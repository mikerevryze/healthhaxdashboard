# HealthHax Dashboard — Project Progress Prompt

Use this as a continuation prompt when starting a new chat session. It contains ALL relevant context about the project, current state, known issues, and next steps.

---

## What We're Building

A **performance dashboard for Health Hax** (a fitness/health client of Revryze) that pulls data from two sources into Snowflake via n8n, then displays it in a React dashboard hosted on Replit:

1. **GHL (GoHighLevel) Opportunities** — pipeline/deal data (leads, closed-won, lost, open deals, monetary values, funnel stages)
2. **Meta (Facebook) Ads** — ad spend, impressions, clicks, and leads at the ad level, daily granularity

**Data flow:**
```
GHL API  ──→  n8n workflow  ──→  Snowflake (GHL_OPPORTUNITIES)  ──→  /api/metrics, /api/funnel
Meta Ads ──→  n8n workflow  ──→  Snowflake (META_ADS_DAILY)     ──→  /api/meta
                                                                          │
                                                                    React Dashboard
                                                              (6 metric cards + funnel + goal calc)
```

---

## Tech Stack

- **Dashboard**: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui, Express backend, hosted on Replit
- **Data warehouse**: Snowflake (database: REVRYZE, schema: RAW)
- **ETL/Orchestration**: n8n (cloud instance)
- **APIs**: Meta Graph API v21.0, GHL API v2021-07-28

---

## GitHub Repo

- **Repo**: `mikerevryze/healthhaxdashboard`
- **Most advanced branch**: `claude/healthhax-pipeline-dashboard-Ll7rg` (has all features including date picker, updated routes, updated workflows)
- **Current working branch**: `claude/create-progress-prompt-N35O8`
- The `master` branch is behind — it does NOT have the date picker, updated routes, or latest workflow fixes

---

## Snowflake Tables (Already Created)

### REVRYZE.RAW.META_ADS_DAILY (18 columns)
```sql
CREATE TABLE REVRYZE.RAW.META_ADS_DAILY (
    PULLED_AT        TIMESTAMP_NTZ,
    DATE_START       DATE           NOT NULL,
    DATE_STOP        DATE,
    AD_ACCOUNT_ID    STRING         NOT NULL,
    CURRENCY         STRING,
    LEVEL            STRING,
    CAMPAIGN_ID      STRING,
    CAMPAIGN_NAME    STRING,
    ADSET_ID         STRING,
    ADSET_NAME       STRING,
    AD_ID            STRING         NOT NULL,
    AD_NAME          STRING,
    IMPRESSIONS      NUMBER(18,0),
    CLICKS           NUMBER(18,0),
    SPEND            NUMBER(18,2),
    LEADS            NUMBER(18,0),
    PURCHASES        NUMBER(18,0),
    RAW_JSON         VARIANT,
    CONSTRAINT pk_meta_ads_daily PRIMARY KEY (DATE_START, AD_ACCOUNT_ID, AD_ID)
);
-- Clustered by (DATE_START, AD_ACCOUNT_ID)
```

### REVRYZE.RAW.GHL_OPPORTUNITIES (19 columns)
```sql
CREATE TABLE REVRYZE.RAW.GHL_OPPORTUNITIES (
    CLIENT_ID            STRING,
    OPPORTUNITY_ID       STRING       NOT NULL,
    LOCATION_ID          STRING,
    CONTACT_ID           STRING,
    PIPELINE_ID          STRING,
    PIPELINE_STAGE_ID    STRING,
    PIPELINE_NAME        STRING,
    PIPELINE_STAGE_NAME  STRING,
    STATUS               STRING,
    NAME                 STRING,
    MONETARY_VALUE       NUMBER(18,2),
    CREATED_AT_STR       STRING,
    CREATED_AT_TS        TIMESTAMP_NTZ,
    UPDATED_AT_STR       STRING,
    UPDATED_AT_TS        TIMESTAMP_NTZ,
    CLOSED_AT_STR        STRING,
    CLOSED_AT_TS         TIMESTAMP_NTZ,
    RAW                  VARIANT,
    PULLED_AT_TS         TIMESTAMP_NTZ,
    CONSTRAINT pk_ghl_opportunities PRIMARY KEY (OPPORTUNITY_ID)
);
-- Clustered by (OPPORTUNITY_ID)
```

---

## n8n Workflows

### 1. Meta Ads → Snowflake (`workflows/meta_ads_to_snowflake.json`)
- **5-node workflow**: Manual Trigger → HTTP Request → Split Out → Code in JavaScript → Snowflake
- **Meta Ad Account ID**: `act_1386514806549794` (Health Hax)
- **API version**: v21.0
- **Fields pulled**: account_id, account_currency, date_start, date_stop, campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name, impressions, clicks, spend, actions
- **Date range**: Uses `time_range[since]` and `time_range[until]` as separate query params (bracket notation — NOT JSON string, n8n can't handle JSON objects in query params)
- **Level**: ad (daily, per-ad granularity via `time_increment=1`)
- **Snowflake SQL**: MERGE (upsert) on PK (DATE_START, AD_ACCOUNT_ID, AD_ID) — safe to re-run
- **Lead extraction**: Counts `lead` + `onsite_conversion.lead_grouped` + `offsite_conversion.fb_pixel_lead` from the `actions` array
- **Meta System User**: `n8n-meta-health-hax` (created in Meta Business Settings with full control on the ad account)
- **Meta App**: `n8n-internal` (published/Live mode — was blocking token generation when in Development mode)
- **Current access token** (in workflow JSON): `EAARVHloh6gsBQ4im068AZCZCI7dYlzuZCot2qN5xPQ08TUxLXydjAEmmhx4Tzm5UwhpCCuVpTNf3p3Ix9Gp1ZCZAILyqb12gDhMrpWXjvrOGZB4McgpF6FkYfhjxG4kbnoMWQyZA2C1FclrnsEieKeOyCtTrVBc2ZCcnVOtTJLycQTebhKcxsm7C6vEbM79c8E4QNQZDZD`
  - **WARNING**: This token may expire (system user tokens last ~60 days). If HTTP Request returns error 190, regenerate token from Business Settings → System Users → n8n-meta-health-hax → Generate New Token

### 2. GHL Opportunities → Snowflake (`workflows/ghl_opportunities_to_snowflake.json`)
- **12-node workflow with pagination loop**: Manual Trigger → Edit Fields → Fetch Pipelines → Build Pipe Map → Build Request Body → HTTP Request → If (has data?) → Split Out → Code in JavaScript → Snowflake → Next Page (loops back)
- **GHL Location ID**: `flh4Lf5SwDi5n025GfVI`
- **GHL API Token**: `Bearer pit-c7fe39b9-e8c8-443e-b3af-451b0b086ead`
- **Pipeline/Stage Name Resolution**: Fetches pipeline metadata first, builds ID-to-name lookup maps, then resolves names during transformation
- **Snowflake SQL**: MERGE on PK (OPPORTUNITY_ID) — idempotent
- **Pagination**: Loops through pages of 100 opportunities until empty response

---

## Dashboard (Replit App)

### Architecture
- **Backend**: Express (server/routes.ts) with 3 API endpoints, Snowflake connector (server/snowflake.ts)
- **Frontend**: React SPA at `/`, single Dashboard page

### Replit Environment Variables (Secrets) — ALREADY CONFIGURED
```
SNOWFLAKE_ACCOUNT
SNOWFLAKE_USER
SNOWFLAKE_PASSWORD
SNOWFLAKE_WAREHOUSE
SNOWFLAKE_DATABASE = REVRYZE
SNOWFLAKE_SCHEMA = RAW
```

### API Endpoints (server/routes.ts)
All 3 endpoints accept optional `?days=30` (rolling window) or `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` (custom range):

1. **GET /api/metrics** — GHL pipeline KPIs
   - Returns: `{ total_leads, closed_won, lost_deals, open_deals, total_value }`
   - Queries GHL_OPPORTUNITIES, filters on CREATED_AT_TS
   - Uses PIPELINE_STAGE_NAME ILIKE patterns to detect won/lost

2. **GET /api/meta** — Meta Ads aggregates
   - Returns: `{ total_spend, total_leads, cpl }`
   - Queries META_ADS_DAILY, filters on DATE_START
   - CPL = total_spend / total_leads

3. **GET /api/funnel** — Pipeline stages (excludes lost)
   - Returns: `[{ pipeline_name, stage_name, count, total_value }]`
   - Groups by PIPELINE_NAME, PIPELINE_STAGE_NAME

### Dashboard Components
- **DateRangePicker** — Preset buttons (30d, 60d, 90d, 120d, All) + calendar picker for custom ranges
- **MetricCard** — 6 cards: Total Leads, Closed Won, Conversion Rate, Total Value, Meta Ad Spend, Meta CPL
- **FunnelChart** — Horizontal bar chart showing deals by pipeline stage
- **GoalCalculator** — Input goal memberships + organic leads ("popips"), calculates required Meta spend based on conversion rate and CPL
- **RecentDeals** — Component exists but NOT currently rendered in dashboard.tsx

---

## KNOWN ISSUES / WHAT'S BROKEN

### 1. Meta Ads Data Is Incomplete/Wrong
**The biggest issue right now.** When the n8n Meta Ads workflow was run, it only returned 4 rows ($16.58 spend, 0 leads) despite the ad account showing $2,314.18 spend and 204 leads in Ads Manager. Possible causes:
- The system user token was initially generated with insufficient permissions (before the app was published to Live mode). A new token was generated after publishing, but we haven't confirmed the new token pulls full data.
- The `actions` array from Meta may not contain the expected action types (`lead`, `offsite_conversion.fb_pixel_lead`, `onsite_conversion.lead_grouped`) — the leads might be tracked under different action types for this specific account.
- **ACTION NEEDED**: Run the workflow again with the new token and verify the row count. If still low, inspect the raw JSON in Snowflake (`SELECT RAW_JSON FROM META_ADS_DAILY LIMIT 5`) to see what action types are actually present.

### 2. Meta Leads vs GHL Leads Are Not Separated
The dashboard currently shows "Total Leads" from GHL (all pipeline opportunities) and "Meta Leads" from META_ADS_DAILY (extracted from Meta's `actions` array). These are NOT the same thing:
- **GHL leads** = all opportunities from all sources (organic, paid, referral, etc.)
- **Meta leads** = only leads attributed to Meta ads
- **The user explicitly wants** to be able to break apart Meta leads from other leads on the dashboard. This hasn't been implemented yet.

### 3. Replit Isn't Pulling From the Right Branch
The Replit project doesn't support git operations via its AI agent. The latest code (date picker, updated routes with date filtering) is on branch `claude/healthhax-pipeline-dashboard-Ll7rg` but Replit may be on master. To sync, either:
- Use Replit Shell: `git fetch origin claude/healthhax-pipeline-dashboard-Ll7rg && git checkout claude/healthhax-pipeline-dashboard-Ll7rg`
- OR paste the file contents directly into Replit's AI chat as a prompt (the approach we've been using)

### 4. Campaign Engagement Period
The user's campaigns are normally **120-day engagements**. The dashboard defaults to 30-day view but has presets up to 120d + "All" + custom date picker. The n8n workflow currently pulls from 2024-08-01 onwards (18 months of history).

---

## WHAT NEEDS TO HAPPEN NEXT (Priority Order)

### Priority 1: Fix Meta Data Quality
1. Re-run the Meta Ads n8n workflow with the latest token
2. Check row count: `SELECT COUNT(*), SUM(SPEND), SUM(LEADS), MIN(DATE_START), MAX(DATE_START) FROM META_ADS_DAILY`
3. If spend is still wrong, inspect the raw data: `SELECT DATE_START, AD_NAME, SPEND, RAW_JSON FROM META_ADS_DAILY LIMIT 20`
4. If leads are 0, check what action types exist: `SELECT DISTINCT f.value:action_type::STRING AS action_type FROM META_ADS_DAILY, LATERAL FLATTEN(input => RAW_JSON:actions) f`
5. Update the Code node in n8n to count the correct action types

### Priority 2: Separate Meta Leads from Other Leads
Add a way to distinguish lead sources on the dashboard:
- "Meta Leads" = leads from META_ADS_DAILY (paid)
- "Organic Leads" = total GHL leads minus Meta leads (or based on source field in GHL data)
- This could be a new card or a breakdown within the existing Total Leads card

### Priority 3: Get Dashboard Code Synced to Replit
The latest code on `claude/healthhax-pipeline-dashboard-Ll7rg` includes:
- DateRangePicker component (presets + calendar)
- Updated routes.ts with date filtering on all 3 endpoints
- Updated dashboard.tsx using the DateRangePicker
These need to be applied to the Replit project (either via git or by pasting code).

### Priority 4: Set Up n8n Schedules
Both workflows are currently manual trigger only. Set up cron schedules:
- Meta Ads: Daily (e.g., 6am) — pulls yesterday's data
- GHL Opportunities: Daily or every 6 hours — keeps pipeline data fresh

### Priority 5: Dashboard Enhancements (Future)
- Add a "Recent Deals" table (component exists, not wired up)
- Add trend charts (spend over time, leads over time)
- Add campaign-level breakdown (data is in META_ADS_DAILY at the ad level, can GROUP BY campaign)
- Multi-client support (CLIENT_ID column exists in GHL table)

---

## Key File Locations (on branch `claude/healthhax-pipeline-dashboard-Ll7rg`)

| File | Purpose |
|------|---------|
| `server/routes.ts` | Express API routes (3 endpoints with date filtering) |
| `server/snowflake.ts` | Snowflake connection + query executor |
| `server/logger.ts` | Simple logging utility |
| `client/src/pages/dashboard.tsx` | Main dashboard page with all cards, funnel, goal calc |
| `client/src/components/DateRangePicker.tsx` | Date preset buttons + calendar picker |
| `client/src/components/MetricCard.tsx` | Individual KPI card |
| `client/src/components/FunnelChart.tsx` | Pipeline funnel horizontal bar chart |
| `client/src/components/GoalCalculator.tsx` | Membership goal → required spend calculator |
| `client/src/components/RecentDeals.tsx` | Deals table (exists, not rendered) |
| `shared/schema.ts` | Zod schemas + TypeScript types (Metrics, MetaMetrics, FunnelStage) |
| `sql/snowflake_meta_ads_daily_table.sql` | META_ADS_DAILY DDL (18 columns) |
| `sql/snowflake_ghl_opportunities_table.sql` | GHL_OPPORTUNITIES DDL (19 columns) |
| `sql/migrate_add_pipeline_stage_names.sql` | Migration to add name columns |
| `sql/views/v_pipeline_funnel.sql` | Optional funnel view |
| `workflows/meta_ads_to_snowflake.json` | n8n workflow JSON for Meta Ads |
| `workflows/ghl_opportunities_to_snowflake.json` | n8n workflow JSON for GHL |

---

## Important Technical Details

- **n8n query param gotcha**: n8n's HTTP Request node mangles JSON objects in query parameter values. Use bracket notation for complex params: `time_range[since]` and `time_range[until]` as separate params instead of `time_range` with a JSON string value.
- **Meta API date_preset values**: Only specific strings are valid (`yesterday`, `today`, `last_7d`, `last_30d`, `last_90d`, `this_month`, `last_month`, `maximum`). Custom date ranges must use `time_range`.
- **SQL injection prevention**: The Code node in both n8n workflows escapes single quotes via `.replace(/'/g, "''")` on all string fields before they hit the Snowflake MERGE statement.
- **Snowflake connector**: Uses `snowflake-sdk` npm package, connection is cached/reused across requests.
- **Dashboard queries use query key as URL**: The React Query setup uses `queryKey` directly as the fetch URL, so `["/api/metrics?days=30"]` fetches that exact URL.
