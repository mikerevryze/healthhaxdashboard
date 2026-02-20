-- Snowflake target table for GHL Opportunities
-- Schema: REVRYZE.RAW (landing zone for raw API data)
-- Idempotent: safe to re-run

CREATE TABLE IF NOT EXISTS REVRYZE.RAW.GHL_OPPORTUNITIES (
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

-- Clustering key for merge performance on large tables
ALTER TABLE REVRYZE.RAW.GHL_OPPORTUNITIES
    CLUSTER BY (OPPORTUNITY_ID);
