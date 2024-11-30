/*-----------------------------------------------------------------------------------------*/
/* This is the most important file. It should be populated with your account IDs, 
correct datasets from your GBQ project, and the start date to pull the data from. 
Follow the comments and substitute all demo info with your data. */
/*-----------------------------------------------------------------------------------------*/

/*Dataform general variables*/
const DATAFORM_LOOKBACK_WINDOW = 4; /*number of days to be updated with incremental runs of dataform*/
const STAGING_DATASET = "demo_dataform_staging"; /*GBQ dataset to store all staging tables*/
const OUTPUT_DATASET = "demo_dataform_output"; /*GBQ dataset to store all tables/models to be used in production*/
const START_DATE = 20241120; /* data will be pulled starting this date (format: YYYYMMDD) */

/* GA4 specific variables */
const GA4_SOURCE_PROJECT = "" /* specify a value here only in case your source data sits in a project other than the default defined in workflow_settings.yaml defaultDatabase variable. You would need to grant the Dataform service account BigQuery Data Viewer and BigQuery Job User access to the dataset. */
const GA4_SOURCE_DATASET = "analytics_332585816"; /* the dataset containing the GA4 BigQuery exports */
const GA4_REPORTING_TIME_ZONE = "Europe/Rome"; /* replace with your GA4 property reporting time zone, this will update the timestamp columns from UTC to your GA4 property timezone (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) */
const GA4_DOMAINS_LIST = ["'help.unicef.org'", "'help.unicef.by'", "'local.ggp.org'", "'unicef.org'"];  /* Specify the domains that you want to include for reporting. GA4 hits occurring on domains not specified in this list will be excluded (e.g., staging environments or spam). If you prefer to include ALL traffic, remove the filter from stg_ga4_events_fixed.sqlx. */

/* Google Ads specific variables */
const GADS_SOURCE_PROJECT = ""; /* specify a value here only in case your source data sits in a project other than the default defined in workflow_settings.yaml defaultDatabase variable. your Google Ads data transfer project. you would need to grant the Dataform service account BigQuery Data Viewer and BigQuery Job User access to the dataset. */
const GADS_SOURCE_DATASET = "googleads_sg"; /* your Google Ads data transfer source dataset */
const GADS_CUSTOMER_ID = ['2700430350','00000']; /* your Google Ads customer ids, excluding the dashes (-), example "1234567890" or ['value1', 'value2', 'value3'] */

/* Meta Ads specific variables */
const META_SOURCE_PROJECT = ""; /* specify a value here only in case your source data sits in a project other than the default defined in workflow_settings.yaml defaultDatabase variable. */
const META_SOURCE_DATASET = "facebookads_vh"; /* Meta data transfer source dataset */
/* const META_SUPERMETRICS_SOURCE_DATASET = "facebook_supermetrics"  Example dataset declaration for Meta historical data */
const META_ACCOUNT_ID = ['864472157600191','406412440942497','00000']; /* your Meta Account ids, example "1234567890" or ['value1', 'value2', 'value3'] */

/* Manual Costs Import via Google Sheets */
const GDRIVE_SOURCE_PROJECT = ""; /* specify a value here only in case your source data sits in a project other than the default defined in workflow_settings.yaml defaultDatabase variable. */
const GDRIVE_SOURCE_DATASET = "google_drive"; /* Specify dataset containing your Manual Cost Import GBQ Table linked to a Google Spreadsheet */

/* Search Console specific variables - OUT OF SCOPE FOR THE DEMO DATAFORM */
/*const SC_SOURCE_PROJECT = ""; /* specify a value here only in case your source data sits in a project other than the default defined in workflow_settings.yaml defaultDatabase variable. */
/*const SC_SOURCE_DATASET = "searchconsole"; /* Search Console data transfer source dataset */

module.exports = {
    DATAFORM_LOOKBACK_WINDOW,
    STAGING_DATASET,
    OUTPUT_DATASET,
    START_DATE,
    GA4_SOURCE_PROJECT,
    GA4_SOURCE_DATASET,
    GA4_REPORTING_TIME_ZONE,
    GA4_DOMAINS_LIST,
    GADS_SOURCE_PROJECT,
    GADS_SOURCE_DATASET,
    GADS_CUSTOMER_ID,
    META_SOURCE_PROJECT,
    META_SOURCE_DATASET,
    /*META_SUPERMETRICS_SOURCE_DATASET*/
    META_ACCOUNT_ID,
    GDRIVE_SOURCE_PROJECT,
    GDRIVE_SOURCE_DATASET
};