-- Snowflake target table for Meta (Facebook) Ads daily metrics — ad-level granularity
-- Schema: REVRYZE.RAW (landing zone for raw API data)
--
-- This is a DROP + CREATE. Run this in a Snowflake worksheet to replace the
-- old 10-column table with the full 18-column ad-level schema.

DROP TABLE IF EXISTS REVRYZE.RAW.META_ADS_DAILY;

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

    -- Primary key enables MERGE (upsert) idempotency
    CONSTRAINT pk_meta_ads_daily PRIMARY KEY (DATE_START, AD_ACCOUNT_ID, AD_ID)
);

-- Clustering for merge/query performance
ALTER TABLE REVRYZE.RAW.META_ADS_DAILY
    CLUSTER BY (DATE_START, AD_ACCOUNT_ID);
