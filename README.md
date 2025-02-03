# Introduction

Welcome to the Global Repository of the Unicef **Global Data & Insights Team** (PFP|IG|D&I). This `demo-dataform` repository serves as a base for the Demo AA Dashboard. It combines data from Google Analytics 4, Google Ads, Meta, and a Manual Cost Import Spreadsheet. Feel free to copy the files into your Dataform or Git instance and adapt them to your own needs.

# Prerequisites

Please ensure you meet all the requirements before working on the Dataform implementation. For the list of prerequisites, contact your D&I focal point or Digital Strategist. ([Internal file](https://unicef.sharepoint.com/:p:/r/teams/PFP-IG/Digital%20closed/1.%20Data%20Insights%20%26%20CRO/06.%20Documentation/0.Global%20Guidelines/Global%20Digital%20Performance%20Dashboard%20-%20requirements.pptx?d=w37467eeef5da46aeb073bd6d3d0eb6ac&csf=1&web=1&e=iFhWbt) )

# Getting Started

## Access

1. **Request access to our Demo AA Dashboard in Looker Studio** to reference the visualizations possible with this kind of backend solution:
   - [Looker Studio Demo AA Dashboard](https://lookerstudio.google.com/reporting/601391ca-c3f1-4e44-89b3-364c5d7b4705/page/p_ktij20osmd)

2. **Ensure your Google Cloud instance is activated**. This repository is built for Dataform, which is part of Google BigQuery.
   - [Learn More about Dataform](https://cloud.google.com/dataform/?hl=en)

3. **If applicable (D&I or CO?), request access from your D&I focal point to the Azure DevOps project** maintained by the D&I Team and get a Git license assigned by Global ICTD:
   - [Sharable Azure DevOps Project](https://unicef.visualstudio.com/public-unicef-global-data)

4. **Request Read access to three Google Spreadsheets used for the demo** and **create copies in your Google Drive**.
   - [Targets used in Looker Studio Demo Dashboard](https://docs.google.com/spreadsheets/d/11MC5j9y9g6M1dN1t_tZbBSD8qEq_2Xcrl2OMOcTTol4/edit?usp=sharing)
   - [Manual costs import used in dataform pipeline](https://docs.google.com/spreadsheets/d/1_wFpp91wV1KwP1mXxRZ8NHF3wr0kV8FlJgk5z8CI9ew/edit?usp=sharing)
   - [Description of metrics and dimensions used in Looker Studio Documentation section](https://docs.google.com/spreadsheets/d/114SzqDV0bFKxtkMdYXw1Vj6FbwRcX981sLeCPkk6ffc/edit?usp=sharing)

## Installation Process

1. **Create a new Dataform Repository within your GBQ, create a development workspace, and copy/clone the files from this Global Repository to your workspace**.
   - [Free 1h community course to get started with DataForm](https://www.datatovalue.academy/c/dataform-for-ga4/)
   - [D&I Internal Guide on how to connect Azure DevOps to DataForm](https://unicef.sharepoint.com/:w:/r/teams/PFP-IG/Digital%20closed/1.%20Data%20Insights%20%26%20CRO/06.%20Documentation/5.%20Git%20Repositories/How%20to%20connect%20Azure%20Repo%20to%20GCP%20Dataform.docx?d=w34a576f067fa49a3acafa187f9c5dec6&csf=1&web=1&e=cbF6Xy)
   - [Google Guide on how to connect your Git Instance to DataForm](https://cloud.google.com/dataform/docs/connect-repository)

2. **Modify `workflow_settings.yaml`** to include your GCP Project and Location, then click on "INSTALL PACKAGES" in the top right.

3. **Connect your copy of the Manual Cost Import File to Google BigQuery**. Create two GBQ tables from 2 tabs with the following names: **`manual_costs_daily`** and **`manual_costs_periodic`**
   - [How to Connect Google Spreadsheet to Google BigQuery](https://cloud.google.com/bigquery/docs/external-data-drive#create_external_tables)

# Adapting the Global Template to Your Needs

## Customize the Global Template to Your Data

1. **`constants.js`** file from the `include` folder. This file should be populated with your account IDs, correct datasets from your GBQ project, and the start date to pull the data from. Follow the comments and substitute all demo info with your data.

2. **`stg_ga4_conversions.sqlx`** file from the `staging` folder. Check the values for `item_category` collected in your GA4 property for cash and pledge donations and adjust the query if necessary. Later you can add other conversions to this table when needed (example: legacy leads).

3. **`stg_ga4_events.sqlx`** file from the `staging` folder. If there are special parameters used in the market that can influence user experience and should be considered in the on-site funnels, you need to unnest the parameters at this stage. This file does not need modification if no special requests are made.

4. **`func_channel_grouping.js`** file from the `includes` folder. Review and adapt the two functions used for channel grouping and cost categorization into pledge and cash based on the naming conventions applied by your market.

5. Ensure that **`src_manual_costs_daily.sqlx`** and **`src_manual_costs_periodic.sqlx`** from the `sources` folder reference the tables you created within GBQ when connecting your copy of the Google Spreadsheet for Manual Costs Import. The `name` in the config should correspond to your table names. Also, do not forget to grant read access to your Dataform service account to the Google Spreadsheet (your default dataform service account `service-YOUR_PROJECT_NUMBER@gcp-sa-dataform.iam.gserviceaccount.com`).



## First Run and Start Debugging

1. For the first run, it is recommended to use a recent `start_date` value in **`constants.js`**, typically one week of data should be sufficient to kick off QA and debugging.

2. Click "START EXECUTION" on top --> then "Actions" --> "Multiple Actions" --> "ALL Actions" --> Check box "Run with full refresh" --> Start Execution.

3. If the execution completes without errors, you should see all the tables generated under the datasets mentioned in **`constants.js`** file (STAGING_DATASET, OUTPUT_DATASET).

4. The output datasets used in the Looker Studio Demo Dashboard are:
    - `tb_campaign_performance_model` is the main model used in most of the Digital Performance Tabs.
    - `tb_landing_page_funnel_model` is used in most of the On-Site Performance Tabs.

5. Once you have the output models correctly generated, you can copy the Looker Studio Demo and substitute the demo sources with your GBQ tables. The dashboard should instantly work with your data as it is based on the same data schemas. If you add more metrics to the final models, make sure to adapt these metrics in the Looker Studio configurations.

## Automated Incremental Daily Runs

1. Once QA is complete and you are satisfied with the queries and outputs, set up the automatic daily runs of the dataform pipeline.
    - Go to "RELEASES & SCHEDULING" in Dataform UI.
    - "CREATE" Release Configuration. Release ID in our examples is "prod", Git commitish is typically "main" but this can be adjusted to the needed git branch name, schedule frequency to your needs. This time is NOT of the dataform execution but when the main dataform release will be updated to the latest version from the Remote Git Repository (where applicable).
    - "CREATE" Workflow Configuration. Configuration ID can be set to "daily", Release Configuration choose from the list the "prod" one. Schedule frequency to your needs. This is the time when dataform will execute the refresh of the tables. Typically you want to refresh the data in the morning. (If possible, make sure to have fresh data from Marketing imports before this time). Do NOT check box "Run full refresh" as you want to keep the daily refresh incremental to save processing costs.


# Additinal Information

## Enable APIs
The following APIs must be enabled.
- Cloud Scheduler API
- BigQuery API
- Dataform API
- Workflows API

## Currency
The base configuration uses local currency by default for reporting. If the currency settings of some of your marketing accounts or GA4 properties do not match, it is possible to adapt the pipeline to your local needs. Customization of queries will be required. 

## Test Environment
We highly recommend setting up a test environment. For this purpose, a connected Git Repository is required. Here is an example of how to enable a test environment:
1. Create a new development space inside Dataform and name it "test" or something similar.
2. Perform any changes within the test development space and commit to the Git remote branch with the same name as your test space. This way, you will not affect your main branch and can safely run any tests you need.
3. Create a new test Release configuration inside Dataform and connect it to your test branch. In the compilation overrides settings, add schema suffix: `test`.
4. Create a new workflow configuration inside Dataform using your test release configuration.
5. Update your test release (this will get the latest version from your test Git branch) and run your test workflow configuration (this will create all tables inside new data sets with the suffix `test`).
6. Create a copy of your Looker Studio dashboard and connect it to the test tables in GBQ.
7. Your test environment is now ready and can be reused without the need to set it up multiple times.

## How to Add More Marketing Sources to the Pipeline?
Our base pipeline currently only considers data from Google Ads and Meta native data transfers. There is also a possibility to add some temporary costs via manual cost spreadsheets. When you decide to add more sources like LinkedIn, Bing, Google Search Console, or anything else, you need to follow these steps:
1. Import the data to GBQ. (There are multiple ways to achieve this. Each market will decide based on the local context and skills.)
2. Define your new source variables in the `included/constants.js` file. Note that there are commented examples of how to add Search Console variables.
3. Create a new source table under `definitions/sources`. It will most likely look very similar to `definitions/sources/src_meta_adinsights_datatransfer.sqlx` — don’t forget to adapt all variables and descriptions.
4. Prepare your data by creating a staging table under `definitions/staging`. It will likely be similar to `definitions/staging/stg_meta_metrics.sqlx`.
5. Merge your new marketing data into the `definitions/output/tb_all_digital_marketing_metrics.sqlx` model by adding a union. Here we also left a commented example of how to add Search Console data.
6. Run a full refresh of the new tables and downstream tables affected by your changes.
7. Test and debug.

## Is it Possible to Add More Transaction Types?
Our base configuration allows grouping transactions into cash and pledge categories. If you need to add more types, such as ecommerce, you will need to adjust the following steps:
1. In `definitions/staging/stg_ga4_conversions.sqlx`, add your new types to the `case when` statement for `transaction_type`.
2. Adapt the `map_transaction_type` function inside `includes/func_channel_grouping.js`. This is used in `tb_campaign_performance_model` and maps costs, clicks, impressions, and sessions to the related transaction type based on campaign naming conventions.
3. If you want to display metrics like CPA for cash/pledge separately or revenue for cash/pledge for your new transaction types, you will need to create these metrics within the Looker Studio data source and add them to the visualizations where needed.

# Description of the generated tables:

| Table Name   | Description                              | Fields  | Comments          |
|--------------|------------------------------------------|---------|-------------------|
| stg_meta_metrics  | Staging table for extracting costs, clicks, and impressions from Meta raw data. Metrics are segmented by date, account, campaign, ad set, and ad.                  | date, account_id, account_name, currency, campaign_id, campaign_name, ad_set_id, ad_set_name, ad_id, ad_name, impressions, clicks, spend     | - |
| stg_gads_metrics  | Staging table for extracting costs, clicks, and impressions from multiple Google Ads raw tables. Metrics are segmented by date, account, campaign, ad set, and ad. | date, customer_id,  campaign_id, campaign_name, ad_group_id, ad_group_name, ad_id, ad_name, impressions, clicks, costs       | - |
| stg_manual_costs_imports    | Staging table for extracting costs from the Manual Import Spreadsheet. Daily costs are recorded as is, while periodic costs are imported as a daily average for the period. Metrics are segmented by date, source, medium, campaign, and account.   | date, source, medium, campaign, account_id, account_name, costs     | - |
| stg_gads_click_campaign    | Staging table for extracting gclids data from multiple Google Ads raw tables. | gclid, date, customer_id, campaign_id, campaign_name, ad_group_id, ad_group_name, ad_id, ad_name, term     | - |
| stg_ga4_events    | Staging table for GA4 Data. Event-level. This table is the initial step in extracting data from GA4 raw tables. It unnests all important fields and prepares the data for future processing. Additionally, at this stage, we introduce `user_key` and `ga_session_key`. | event_timestamp, event_datetime, event_date, user_key, ga_session_key, event_name, event_params.key, event_params.value.string_value, event_params.value.int_value, event_params.value.float_value, event_params.value.double_value, event_previous_timestamp, event_value_in_usd, event_bundle_sequence_id, event_server_timestamp_offset, user_id, user_pseudo_id, user_properties.key, user_properties.value.string_value, user_properties.value.int_value, user_properties.value.float_value, user_properties.value.double_value, user_properties.value.set_timestamp_micros, user_first_touch_timestamp, device.category, device.mobile_brand_name, device.mobile_model_name, device.mobile_marketing_name, device.mobile_os_hardware_model, device.operating_system, device.operating_system_version, device.vendor_id, device.advertising_id, device.language, device.is_limited_ad_tracking, device.time_zone_offset_seconds, device.browser, device.browser_version, device.web_info.browser, device.web_info.browser_version, device.web_info.hostname, geo.city, geo.country, geo.continent, geo.region, geo.sub_continent, geo.metro, app_info.id, app_info.version, app_info.install_store, app_info.firebase_app_id, app_info.install_source, is_active_user, traffic_source.source, traffic_source.medium, traffic_source.campaign, collected_traffic_source.manual_campaign_id, collected_traffic_source.manual_campaign_name, collected_traffic_source.manual_source, collected_traffic_source.manual_medium, collected_traffic_source.manual_content, collected_traffic_source.manual_term, collected_traffic_source.gclid, collected_traffic_source.dclid, stream_id, platform, ecommerce.total_item_quantity, ecommerce.purchase_revenue_in_usd, ecommerce.purchase_revenue, ecommerce.refund_value_in_usd, ecommerce.refund_value, ecommerce.shipping_value_in_usd, ecommerce.shipping_value, ecommerce.tax_value_in_usd, ecommerce.tax_value, ecommerce.unique_items, ecommerce.transaction_id, items.item_id, items.item_name, items.item_brand, items.item_variant, items.item_category, items.item_category2, items.item_category3, items.item_category4, items.item_category5, items.price_in_usd, items.price, items.quantity, items.item_revenue_in_usd, items.item_revenue, items.item_refund_in_usd, items.item_refund, items.coupon, items.affiliation, items.location_id, items.item_list_id, items.item_list_name, items.item_list_index, items.promotion_id, items.promotion_name, items.creative_name, items.creative_slot, items.item_params.key, items.item_params.value.string_value, items.item_params.value.int_value, items.item_params.value.float_value, items.item_params.value.double_value, ga_session_id, page_location, ga_session_number, engagement_time_msec, page_title, page_referrer, page_hostname, page_fullpath, page_querystring, event_traffic_source.source, event_traffic_source.medium, event_traffic_source.campaign, event_traffic_source.content, event_traffic_source.term, event_traffic_source.gclid, event_traffic_source.dclid, session_engaged, privacy_analytics_storage, privacy_ads_storage, privacy_uses_transient_token, donationType, hitTimestamp, fullPageReferrer, originalPageUrl, pageCategory, pageSubcategory, pageType, paymentType, paymentMethod, paymentProvider, queryString, sessionId, transaction_id, transactionId, eventAction, eventLabel, funnelStep, content_id, content_label, content_type, pageOwner, pl_country, pl_language, country_code, languageCode, currency, debugMode, debug_mode, dataLayerEvent, defaultAmountMonthlySelected, defaultAmountOnceSelected, defaultAmountsMonthly, defaultAmountsOnce, defaultDonationType, otherAmount, donationStep, donationAmount, donorType, formType, fundType, fundsDestinations, emailSignup, phoneSignup, smsSignup, whatsappSignup, exp_variant_string, errorMessage| Tip: if you need to add more unnested values, add them at this step. Keep the data as close to raw as possible at this stage.|
| stg_ga4_events_fixed   | Staging Table for GA4 Event-Level Data. This staging table contains all fields from `stg_ga4_events` with corrected attributions for the `collected_traffic_source` and `event_traffic_source` fields. Additionally, it includes a new field, `event_sort_order`, which will be used for session attribution in subsequent steps. This is the initial step where we apply modifications to the raw data. Here, we also filter out data from staging domains. | all the fields from `stg_ga4_events` plus the following: event_traffic_source.fixed_source, event_traffic_source.fixed_medium, event_traffic_source.fixed_campaign, event_traffic_source.fixed_term, event_traffic_source.fixed_ad_name, event_traffic_source.fixed_adgroup_name, collected_traffic_source.fixed_source, collected_traffic_source.fixed_medium, collected_traffic_source.fixed_campaign, collected_traffic_source.fixed_campaign_id, collected_traffic_source.fixed_term, collected_traffic_source.fixed_ad_name, collected_traffic_source.fixed_adgroup_name, collected_traffic_source.fixed_adgroup_id, collected_traffic_source.manual_campaign_id, collected_traffic_source.manual_campaign_name, collected_traffic_source.manual_source, collected_traffic_source.manual_medium, collected_traffic_source.manual_content, collected_traffic_source.manual_term, collected_traffic_source.gclid, collected_traffic_source.dclid, event_sort_order  | Tip: Use this table for your ad hoc analysis instead of querying raw GA4 tables. |
| stg_ga4_sessions   | Staging Table for GA4 Session-Level Data: At this stage, we define session-level attribution (first non-null touch or last non-null touch), dimensions, and metrics. | user_key, ga_session_key, ga_session_id, user_pseudo_id, session_start_datetime, session_start_date, has_session_start_event, session_engaged, engagement_time_seconds, user_first_visit_datetime, session_total_events, session_unique_events, session_page_views, session_unique_page_views, session_view_promotion, session_select_promotion, session_view_item_list, session_select_item, session_add_to_cart, session_begin_checkout, session_add_payment_info, session_add_shipping_info, session_transactions, session_purchase_revenue_usd, session_purchase_revenue_local_currency, session_personal_information, session_donation_funnel, session_donations, session_form_click, session_experience_impression, session_payment_details, session_payment_failed, first_traffic_source.fixed_source, first_traffic_source.fixed_medium, first_traffic_source.fixed_campaign, first_traffic_source.fixed_campaign_id, first_traffic_source.fixed_term, first_traffic_source.fixed_adgroup_name, first_traffic_source.fixed_ad_name, first_traffic_source.fixed_channel_type, first_traffic_source.manual_campaign_id, first_traffic_source.manual_campaign_name, first_traffic_source.manual_source, first_traffic_source.manual_medium, first_traffic_source.manual_content, first_traffic_source.manual_term, first_traffic_source.gclid, first_traffic_source.dclid, last_non_null_traffic_source.fixed_source, last_non_null_traffic_source.fixed_medium, last_non_null_traffic_source.fixed_campaign, last_non_null_traffic_source.fixed_campaign_id, last_non_null_traffic_source.fixed_term, last_non_null_traffic_source.fixed_adgroup_name, last_non_null_traffic_source.fixed_ad_name, last_non_null_traffic_source.fixed_channel_type, last_non_null_traffic_source.manual_campaign_id, last_non_null_traffic_source.manual_campaign_name, last_non_null_traffic_source.manual_source, last_non_null_traffic_source.manual_medium, last_non_null_traffic_source.manual_content, last_non_null_traffic_source.manual_term, last_non_null_traffic_source.gclid, last_non_null_traffic_source.dclid, landing_page_path, landing_page_location, landing_hostname, landing_event, session_device_category, session_mobile_brand_name, session_mobile_model_name, session_mobile_marketing_name, session_operating_system, session_operating_system_version, session_browser, session_browser_version, session_browser_language, session_continent, session_sub_continent, session_country, session_region, session_city, country_code, session_start, session_end, session_length_seconds, landing_pl_country, landing_pl_language, landing_exp_variant_string, landing_page_owner, landing_currency, landing_default_amount_monthly_selected, landing_default_amount_once_selected, landing_default_amounts_monthly, landing_default_amounts_once, landing_default_donation_type, last_other_amount, last_whatsapp_signup, last_sms_signup, last_phone_signup, last_email_signup, last_funnel_step, last_donation_type | - |
| stg_ga4_conversions   | Staging Table for GA4 Conversions: Conversions may include both donations and key events (e.g., legacy leads). | user_key, ga_session_key, transaction_id, additional_transaction_id, purchase_revenue, purchase_revenue_in_usd, local_currency, payment_type, funds_destinations, transaction_type, date, first_traffic_source.fixed_source, first_traffic_source.fixed_medium, first_traffic_source.fixed_campaign, first_traffic_source.fixed_campaign_id, first_traffic_source.fixed_term, first_traffic_source.fixed_ad_name, first_traffic_source.fixed_adgroup_name, first_traffic_source.fixed_adgroup_id, first_traffic_source.manual_campaign_id, first_traffic_source.manual_campaign_name, first_traffic_source.manual_source, first_traffic_source.manual_medium, first_traffic_source.manual_content, first_traffic_source.manual_term, first_traffic_source.gclid, first_traffic_source.dclid, landing_hostname, device | Note: The base configuration considers only donations as conversions. Begin modifying the pipeline from this step to include additional conversions if necessary. |
| src_non_custom_events   | The source table contains a list of default GA4 events.  | event_name  | Most likely, this will be a static table. If there is a need to update the list, you should update `includes/non_custom_events.js` and then run a full refresh of `src_non_custom_events` |
| src_source_categories   | The source table contains a list of domains recognized by Google, each associated with a related source category. There are four possible categories: Search, Social, Video, and Shopping. The Categories are used in Custom Channel Groupings  | source, source_category    | Most likely, this will be a static table. If there is a need to update the list, you should update `includes/source_categories.js` and then run a full refresh of `src_source_categories`  |
| tb_all_digital_marketing_metrics   | Data model containing aggregated marketing metrics (impressions, clicks, costs) from all available digital marketing sources. | date, hostname, source, medium, campaign, ad_group, ad_name, impressions, clicks, costs  | Tip: It is sufficient to add data from any new digital marketing sources up to this stage. |
| tb_campaign_performance_model   | The Main Data Model. Used in the majority of the Looker Studio Dashboard. It aggregates marketing metrics (impressions, costs, etc.), traffic metrics (sessions), and conversions. The Channel field is also created at this stage. | date, week_date, month, landing_hostname, device, channel, source, medium, campaign, ad_group, ad_name, donation_type, sessions, transactions, revenue, impressions, clicks, costs  | - |
| tb_landing_page_funnel_model  | Data model based on GA4 data, used in on-site funnel reports of the Looker dashboard. | date, landing_hostname, landing_page_path, session_city, landing_exp_variant_string, session_device_category, session_operating_system, source, medium, campaign, ad_group, ad_name, session_start, bounce, form_click, add_to_cart, add_payment_info, session_with_transactions, session_with_experiments, week_date, month, channel, transaction_id, purchase_revenue, transaction_type | - |

