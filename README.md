# Introduction

Welcome to the Global Repository of the Unicef Global Data & Insights Team (PFP|IG). This `demo-dataform` repository serves as a base for the Demo AA Dashboard. It combines data from Google Analytics 4, Google Ads, Meta, and a Manual Cost Import Spreadsheet. Feel free to copy the files into your Dataform or Git instance and adapt them to your own needs.

# Getting Started

## Access

1. **Request access to our Demo AA Dashboard in Looker Studio** to reference the visualizations possible with this kind of backend solution:
   - [Looker Studio Demo AA Dashboard](https://lookerstudio.google.com/reporting/601391ca-c3f1-4e44-89b3-364c5d7b4705/page/p_ktij20osmd)

2. **Ensure your Google Cloud instance is activated**. This repository is built for Dataform, which is part of Google BigQuery.
   - [Learn More about Dataform](https://cloud.google.com/dataform/?hl=en)

3. **If applicable (D&I or CO?), request access from your D&I focal point to the Azure DevOps project** maintained by the D&I Team and get a Git license assigned by Global ICTD:
   - [Sharable Azure DevOps Project](https://unicef.visualstudio.com/public-unicef-global-data)

4. **Request Read access to two Google Spreadsheets used for the demo** and **create copies in your Google Drive**.
   - [Targets used in Looker Studio Demo Dashboard](https://docs.google.com/spreadsheets/d/11MC5j9y9g6M1dN1t_tZbBSD8qEq_2Xcrl2OMOcTTol4/edit?usp=sharing)
   - [Manual costs import used in dataform pipeline](https://docs.google.com/spreadsheets/d/1_wFpp91wV1KwP1mXxRZ8NHF3wr0kV8FlJgk5z8CI9ew/edit?usp=sharing)

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
    - `tb_donations_model` is used in the Donations Sections (TBC).

5. Once you have the output models correctly generated, you can copy the Looker Studio Demo and substitute the demo sources with your GBQ tables. The dashboard should instantly work with your data as it is based on the same data schemas. If you add more metrics to the final models, make sure to adapt these metrics in the Looker Studio configurations.

## Automated Incremental Daily Runs

1. Once QA is complete and you are satisfied with the queries and outputs, set up the automatic daily runs of the dataform pipeline.
    - Go to "RELEASES & SCHEDULING" in Dataform UI.
    - "CREATE" Release Configuration. Release ID in our examples is "prod", Git commitish is typically "main" but this can be adjusted to the needed git branch name, schedule frequency to your needs. This time is NOT of the dataform execution but when the main dataform release will be updated to the latest version from the Remote Git Repository (where applicable).
    - "CREATE" Workflow Configuration. Configuration ID can be set to "daily", Release Configuration choose from the list the "prod" one. Schedule frequency to your needs. This is the time when dataform will execute the refresh of the tables. Typically you want to refresh the data in the morning. (If possible, make sure to have fresh data from Marketing imports before this time). Do NOT check box "Run full refresh" as you want to keep the daily refresh incremental to save processing costs.

# WORK IN PROGRESS

1. Add prerequisites for the enabled APIs?
2. Data Requirements?
3. List all the tables and a short description for each
4. how to add more marketing sources
5. how to copy looker studio template properly
