-- Snowflake target table for Meta (Facebook) Ads daily metrics
-- Schema: REVRYZE.RAW (landing zone for raw API data)
-- Idempotent: safe to re-run

CREATE TABLE IF NOT EXISTS REVRYZE.RAW.META_ADS_DAILY (
    DATE_KEY             DATE          NOT NULL,
    AD_ACCOUNT_ID        STRING        NOT NULL,
    CAMPAIGN_ID          STRING,
    CAMPAIGN_NAME        STRING,
    SPEND                NUMBER(18,2),
    IMPRESSIONS          NUMBER(18,0),
    CLICKS               NUMBER(18,0),
    LEADS                NUMBER(18,0),
    RAW                  VARIANT,
    PULLED_AT_TS         TIMESTAMP_NTZ,

    CONSTRAINT pk_meta_ads_daily PRIMARY KEY (DATE_KEY, AD_ACCOUNT_ID, CAMPAIGN_ID)
);

-- Optional: clustering for merge performance
ALTER TABLE REVRYZE.RAW.META_ADS_DAILY
    CLUSTER BY (DATE_KEY, AD_ACCOUNT_ID);
