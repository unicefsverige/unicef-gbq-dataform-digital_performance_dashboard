/**
 * Unnests a column in a SQL query.

 * Args:
 *   columnToUnnest: The column to unnest.
 *   keyToExtract: The key to extract from the unnested column.
 *   valueType: The type of the value to extract.

 * Returns:
 *   A SQL query that unnests the column.
 */
function unnestColumn(columnToUnnest, keyToExtract, valueType="string_value") {
    return `(select value.${valueType} from unnest(${columnToUnnest}) where key = '${keyToExtract}')`;
};



/**

 * Updates the traffic source, medium, campaign, term to google paid search when gclid is present.

 * Args:
 *   struct: The name of the struct to update.
 *   structColumn: The name of the struct column to update.
 *   tableAlias: The alias of the table whose fields are being updated.
 *   gadsInfo: The name/keyword of the google ads campaign/term retrieved from the gads exports.

 * Returns:
 *   A SQL expression that updates the structColumn
 
 **/

function fixPaidGoogleTrafficSource(struct, structColumn, tableAlias, gadsInfo) {
    // Check base conditions: presence of paid click indicators
    const conditions = `${tableAlias}.${struct}.gclid is not null or 
                        ${tableAlias}.${struct}.dclid is not null or 
                        ${tableAlias}.page_location like '%gbraid%' or 
                        ${tableAlias}.page_location like '%wbraid%'`;
    
    return `CASE
                WHEN ${conditions} THEN
                    CASE
                        WHEN '${structColumn}' LIKE '%campaign_id%' THEN
                            COALESCE(SAFE_CAST(${gadsInfo} AS STRING), SAFE_CAST(${tableAlias}.${struct}.${structColumn} AS STRING))
                        WHEN '${structColumn}' LIKE '%term%' THEN
                            COALESCE(SAFE_CAST(${gadsInfo} AS STRING), SAFE_CAST(${tableAlias}.${struct}.${structColumn} AS STRING))
                        WHEN '${structColumn}' LIKE '%campaign%' THEN
                            COALESCE(SAFE_CAST(${gadsInfo} AS STRING), 'gads_campaign_value_missing')
                        WHEN '${structColumn}' LIKE '%source%' THEN
                            CASE
                                WHEN ${tableAlias}.${struct}.dclid is not null 
                                THEN 'google' --dbm
                                ELSE 'google'
                            END
                        WHEN '${structColumn}' LIKE '%medium%' THEN
                            CASE
                                WHEN ${tableAlias}.${struct}.dclid is not null 
                                THEN 'cpc' --cpm
                                ELSE 'cpc'
                            END
                    END
                ELSE SAFE_CAST(${tableAlias}.${struct}.${structColumn} AS STRING) -- Default if no campaign identifiers are found
            END`;
}

/**
 * Adds new fileds for ad_group_name, ad_group_id, ad_name to google paid search when gclid is present.

 * Args:
 *   struct: The name of the struct to update.
 *   structColumn: The name of the struct column to update.
 *   tableAlias: The alias of the table whose fields are being updated.
 *   gadsInfo: The name of the google ads group or ad retrieved from the gads exports.

 * Returns:
 *   A SQL expression that updates the structColumn
 * 
 * 
 *  **/

function getPaidGoogleTrafficSource(struct, createColumn, tableAlias, gadsInfo) {
    // Check base conditions: presence of paid click indicators
    const conditions = `${tableAlias}.${struct}.gclid is not null or 
                        ${tableAlias}.${struct}.dclid is not null or 
                        ${tableAlias}.page_location like '%gbraid%' or 
                        ${tableAlias}.page_location like '%wbraid%'`;
    
    return `CASE
                WHEN ${conditions} THEN
                    CASE
                        WHEN '${createColumn}' LIKE '%ad_group_name%' THEN
                            COALESCE(SAFE_CAST(${gadsInfo} AS STRING), 'gads_adgroup_value_missing')
                        WHEN '${createColumn}' LIKE '%ad_group_id%' THEN
                            COALESCE(SAFE_CAST(${gadsInfo} AS STRING), 'gads_adgroupid_value_missing')
                        WHEN '${createColumn}' LIKE '%ad_name%' THEN
                            COALESCE(SAFE_CAST(${gadsInfo} AS STRING), 'gads_adname_value_missing')
                    END
                ELSE null
            END`;
}



/**
 * Build a query that will be used for retrieving source categories.
 * Returns:
 *   A SQL expression that selects source categories
*/
function selectSourceCategories(){
    let selectStatement = '';
    let i = 0;
    let { sourceCategories } = require("./source_categories.js");
    let sourceCategoriesLength = Object.keys(sourceCategories).length;
    for (row of sourceCategories) {
        i++;
        selectStatement = selectStatement.concat(`select "` + row.source + `" as source, "`+  row.sourceCategory + `" as source_category`);
        if (i < sourceCategoriesLength) {
            selectStatement = selectStatement.concat(` union distinct `)
        }
    }
    return selectStatement;
}

/**
 * Build a query that will be used for retrieving custom events.
 * Returns:
 *   A SQL expression that selects custom events
*/
function selectNonCustomEvents(){
    let selectStatement = '';
    let i = 0;
    let { nonCustomEvents } = require("./non_custom_events.js");
    let nonCustomEventsLength = Object.keys(nonCustomEvents).length;
    for (row of nonCustomEvents) {
        i++;
        selectStatement = selectStatement.concat(`select "` + row.eventName + `" as event_name`);
        if (i < nonCustomEventsLength) {
            selectStatement = selectStatement.concat(` union distinct `)
        }
    }
    return selectStatement;
}

module.exports = { 
    unnestColumn, 
    selectSourceCategories, 
    selectNonCustomEvents,
    fixPaidGoogleTrafficSource, 
    getPaidGoogleTrafficSource 
    };






