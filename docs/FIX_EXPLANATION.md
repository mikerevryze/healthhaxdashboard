# GHL → Snowflake Pagination Fix

## What Was Wrong

Your HTTP Request body field contained:

```
=  ={{ JSON.stringify({ locationId: $json.locationId, limit: $json.limit, page: $json.page }) }}
```

GHL received this as the raw body:

```
"  ={"page":1}"
```

### Three bugs in one line

1. **`=  =` double prefix** — you have a literal `=`, whitespace, then `={{ }}`. The first `=` is not an expression marker in Raw body mode — it's literal text sent to the API.

2. **`=` prefix not consumed in Raw body textarea** — In n8n, the `=` expression prefix (`={{ expr }}`) is only recognized in **parameter fields** (dropdowns, single-line inputs). In the Raw body **textarea**, n8n uses **template interpolation**: only `{{ }}` blocks are evaluated, everything else is literal. The `=` is sent as-is.

3. **Missing `locationId` and `limit` in Set node** — Your "Edit Fields" only initialized `page` and `has_more`. `$json.locationId` and `$json.limit` were `undefined`, so `JSON.stringify` produced `{"page":1}` with the other fields missing.

### Additional pagination bug

Your "Edit Fields1" used:
```
$item(0).$node["Edit Fields"].json.page + 1
```

This always references the **original** "Edit Fields" output (page=1), so the page would always be calculated as `1 + 1 = 2`. The pagination would never advance past page 2.

---

## The Fix

### Architecture Change

```
BEFORE:
  Trigger → Edit Fields → HTTP Request → Split Out → Code → Edit Fields1 → If → Snowflake → HTTP Request (loop)

AFTER:
  Trigger → Edit Fields → Build Request Body → HTTP Request → If → Split Out → Code → Snowflake → Next Page → Build Request Body (loop)
```

Key changes:
- **New "Build Request Body" Code node** — builds the JSON body string in V8 with correct types
- **If moved BEFORE Split Out** — checks the HTTP response for opportunities before splitting
- **New "Next Page" Code node** — replaces Edit Fields1, correctly increments page by referencing the current loop iteration
- **Edit Fields** — now includes `limit` (number) and `locationId` (string)

### Node Details

#### Edit Fields (Init)
```
page:       number = 1
limit:      number = 100
locationId: string = "flh4Lf5SwDi5n025GfVI"
```

#### Build Request Body (Code node)
```javascript
const page = Number($input.first().json.page);
const limit = Number($input.first().json.limit);
const locationId = String($input.first().json.locationId);

return [{
  json: {
    requestBody: JSON.stringify({
      locationId: locationId,
      limit: limit,
      page: page
    }),
    page: page,
    limit: limit,
    locationId: locationId
  }
}];
```

This runs in V8 (pure JavaScript). No n8n expression parser, no body serializer, no type coercion bugs. `JSON.stringify` produces `{"locationId":"flh4Lf5SwDi5n025GfVI","limit":100,"page":1}` with correct number types.

#### HTTP Request
```
Body Content Type: Raw / Custom
MIME Type:         application/json
Body:              {{ $json.requestBody }}
```

**No `=` prefix.** Just `{{ $json.requestBody }}`. The `{{ }}` template interpolation pastes the pre-built JSON string directly into the body. No transformation, no wrapping, no quoting.

#### If (check for more data)
```
Condition: {{ ($json.opportunities || []).length }} > 0
```

Checks the raw HTTP response BEFORE Split Out. If the API returns an empty `opportunities` array, routes to Stop and Error.

#### Next Page (Code node, after Snowflake)
```javascript
const currentPage = $('Build Request Body').first().json.page;
const limit = $('Build Request Body').first().json.limit;
const locationId = $('Build Request Body').first().json.locationId;

return [{
  json: {
    page: currentPage + 1,
    limit: limit,
    locationId: locationId
  }
}];
```

References `$('Build Request Body')` which returns the **current loop iteration's** output (not a fixed value). Outputs a single item with page+1 to feed back into Build Request Body.

---

## Why Each Failed Approach Cannot Work

| Approach | Why it fails |
|----------|-------------|
| Raw body with `={{ expr }}` | `=` is literal text in textarea mode, gets sent to API |
| Raw body with `= ={{ expr }}` | Same — doubled `=` both appear in output |
| "Using JSON" with `{ "page": {{expr}} }` | n8n's JSON.parse() pre-validation rejects `{{expr}}` as invalid JSON |
| "Using JSON" with `"page": "{{expr}}"` | Sends page as string `"1"` — GHL 422 |
| "Using Fields Below" | All values coerced to strings — GHL 422 |
| Code node + `{{ $json.requestBody }}` in Raw | Works — template interpolation of a pre-built string |
