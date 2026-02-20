# GHL → Snowflake Pagination Fix

## Problem Summary

Two distinct failures when dynamically injecting `page` into the HTTP Request body for `POST /opportunities/search`:

| Mode | Symptom | Root Cause |
|------|---------|------------|
| **Using JSON** | `JSON parameter needs to be valid JSON` | n8n pre-validates raw JSON text **before** resolving `{{ }}` expressions |
| **Using Fields Below** | `422: limit must be a number` | n8n serializes all field values as **strings**, GHL's `class-validator` rejects them |

---

## Why This Happens in n8n v2.6.3

### Problem 1: "Using JSON" mode

When you write:

```json
{
  "locationId": "flh4Lf5SwDi5n025GfVI",
  "limit": 100,
  "page": {{$json.page}}
}
```

n8n's expression engine works in two passes:

1. **Static validation pass**: n8n calls `JSON.parse()` on the raw text to check syntax.
2. **Expression resolution pass**: n8n replaces `{{ }}` tokens with runtime values.

The problem: `{{$json.page}}` is not valid JSON. `JSON.parse()` fails at step 1 before expressions are ever resolved. This is a known limitation of n8n's JSON body mode — you cannot embed bare expressions where a JSON value is expected.

Wrapping it in quotes (`"{{$json.page}}"`) would pass JSON.parse but send the value as a **string**, which triggers the same 422 as Problem 2.

### Problem 2: "Using Fields Below" mode

n8n's "Using Fields Below" sends all parameter values through its internal serializer, which coerces everything to strings. The outbound request body becomes:

```json
{
  "locationId": "flh4Lf5SwDi5n025GfVI",
  "limit": "100",
  "page": "1"
}
```

The GHL API uses NestJS + `class-validator` with `@IsNumber()` / `@Min()` decorators on `limit` and `page`. These decorators perform strict type checking — `"100"` (string) ≠ `100` (number) — and return 422.

---

## The Fix

### HTTP Request Node Configuration

| Setting | Value |
|---------|-------|
| **Method** | POST |
| **URL** | `https://services.leadconnectorhq.com/opportunities/search` |
| **Body Content Type** | `Raw / Custom` |
| **MIME Type** | `application/json` |
| **Body** | `={{ JSON.stringify({ locationId: $json.locationId, limit: $json.limit, page: $json.page }) }}` |

### Why This Works

The entire body field is a **single n8n expression** (starts with `=`). When n8n sees the `=` prefix:

1. It skips static JSON validation entirely (the field is treated as an expression, not raw JSON).
2. It evaluates the JavaScript expression at runtime.
3. `JSON.stringify()` produces a valid JSON string with correct types:
   - `locationId` → string (from Set node string field)
   - `limit` → number (from Set node number field)
   - `page` → number (from Set node number field)

The `Raw / Custom` content type with MIME `application/json` ensures:
- n8n does not attempt to parse or transform the body
- The `Content-Type: application/json` header is set automatically
- The raw output of `JSON.stringify()` is sent as-is

### Critical Detail: Set Node Types

The **Init Pagination** and **Increment Page** Set nodes must define `page` and `limit` as **Number** type fields, not String. This ensures `$json.page` resolves to a JavaScript number, so `JSON.stringify()` serializes it as `100` not `"100"`.

```
Set Node → Values → Number:
  - name: page,  value: 1
  - name: limit, value: 100
```

---

## Pagination Loop Logic

```
Init Pagination (page=1, limit=100, hasMore=true)
    ↓
GHL Search Opportunities (HTTP POST with expression body)
    ↓
Split Out (opportunities array)
    ↓
Map Fields (Code node: normalize to Snowflake schema)
    ↓
Snowflake MERGE (idempotent upsert on OPPORTUNITY_ID)
    ↓
Increment Page (page++, recompute hasMore from meta)
    ↓
More Pages? (IF: hasMore=true AND opportunities.length >= 1)
    ├─ true → loop back to GHL Search Opportunities
    └─ false → end
```

### Loop Termination

The IF node checks two conditions (AND):

1. `hasMore` is true (computed from `meta.total > meta.currentPage * limit`)
2. The last response contained at least 1 opportunity

This double-check prevents infinite loops if the API returns an empty page but `meta` is stale.

---

## Alternative Fix: Code Node as Body Builder

If you prefer not to use Raw body mode, you can insert a **Code node** immediately before the HTTP Request that outputs the body as a JSON object, then reference it:

```javascript
// Code node: "Build Request Body"
return [{
  json: {
    requestBody: {
      locationId: $json.locationId,
      limit: Number($json.limit),
      page: Number($json.page)
    }
  }
}];
```

Then in the HTTP Request node, use Raw body:
```
={{ JSON.stringify($json.requestBody) }}
```

This adds an extra node but makes the type coercion explicit with `Number()`.

---

## Verification Checklist

- [ ] HTTP Request Body Content Type = **Raw / Custom**
- [ ] MIME Type = **application/json**
- [ ] Body starts with `=` (expression mode)
- [ ] Body uses `JSON.stringify()` to serialize
- [ ] Set nodes define `page` and `limit` as **Number** type
- [ ] `locationId` is defined as **String** type
- [ ] Authorization header includes valid GHL API key
- [ ] `Version` header is set to `2021-07-28`
- [ ] IF node checks both `hasMore` AND `opportunities.length >= 1`
- [ ] Snowflake credential ID is configured in the MERGE node
