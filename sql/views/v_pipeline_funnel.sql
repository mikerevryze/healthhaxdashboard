-- View: Pipeline Funnel
-- Shows how many opportunities are in each pipeline stage right now,
-- plus the total and average dollar value per stage.
--
-- USE CASE: Dashboard KPI cards + funnel chart
-- Example: "You have 12 deals in 'Appointment Booked' worth $34,000 total"

CREATE OR REPLACE VIEW REVRYZE.RAW.V_PIPELINE_FUNNEL AS

SELECT
    PIPELINE_NAME,                              -- e.g. "Sales Pipeline"
    PIPELINE_STAGE_NAME,                        -- e.g. "Appointment Booked", "Closed-Won"
    COUNT(*)                AS OPP_COUNT,       -- how many deals in this stage
    SUM(MONETARY_VALUE)     AS TOTAL_VALUE,     -- total dollar value in this stage
    AVG(MONETARY_VALUE)     AS AVG_VALUE,       -- average deal size in this stage
    MIN(CREATED_AT_TS)      AS EARLIEST_CREATED,-- oldest deal in this stage
    MAX(UPDATED_AT_TS)      AS LATEST_ACTIVITY  -- most recent movement in this stage

FROM REVRYZE.RAW.GHL_OPPORTUNITIES

WHERE STATUS != 'lost'                          -- exclude dead deals

GROUP BY PIPELINE_NAME, PIPELINE_STAGE_NAME

ORDER BY PIPELINE_NAME, OPP_COUNT DESC;
