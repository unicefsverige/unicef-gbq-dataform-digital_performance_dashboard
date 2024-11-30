/*-----------------------------------------------------------------------------------------*/
/* This file contains two functions for categorizing channels and costs into pledge or cash. 
Both functions should be carefully reviewed during the debugging and QA stages 
and adapted to the naming conventions used by your market. 
Please note that in CASE WHEN statements, the first condition listed is applied first.*/
/*-----------------------------------------------------------------------------------------*/


function custom_channel_grouping(source, medium, campaign, category) {

    return `
      CASE

        WHEN 
          ${source} IN ('google','bing','yahoo','yandex','seznam','baidoo') 
          AND ${medium} IN ('cpc')
          AND ${campaign} LIKE "%_Search_%"
        THEN 'Paid Search'

        WHEN 
          ${source} IN ('google','bing','yahoo','yandex','seznam','baidoo') 
          AND REGEXP_CONTAINS(${medium}, r'^(.*cp.*|ppc|paid.*)$') 
          AND ${campaign} LIKE "%_PerfMax_%"
        THEN 'Google Performance Max'

        WHEN 
          ${source} IN ('google','bing','yahoo','yandex','seznam','baidoo') 
          AND REGEXP_CONTAINS(${medium}, r'^(.*cp.*|ppc|paid.*)$') 
          AND ${campaign} LIKE "%_DemandGen_%"
        THEN 'Google Demand Gen'

        WHEN 
          ${source} IN ('google') 
          AND REGEXP_CONTAINS(${medium}, r'^(.*cp.*|ppc|paid.*)$') 
        THEN 'Google Display'

        WHEN 
          REGEXP_CONTAINS(${source}, r'^(twitter|facebook|fb|instagram|ig|linkedin|pinterest|meta)$')
          AND REGEXP_CONTAINS(${medium}, r'^(.*cp.*|ppc|paid.*|social_paid|paid_social)$') 
        THEN 'Paid Social'

        WHEN 
          ${campaign} LIKE '%shop%'
          AND REGEXP_CONTAINS(${medium}, r'^(.*cp.*|ppc|paid.*)$') 
        THEN 'Paid Shopping'

        WHEN 
          ${medium} IN ('display','banner','expandable','interstitial','cpm','programmatic', 'cpc') 
        THEN 'Display'

        WHEN 
          REGEXP_CONTAINS(${medium}, r'^(.*cp.*|ppc|paid.*)$') 
        THEN 'Other Paid'

        WHEN 
          ${category} = "SOURCE_CATEGORY_SOCIAL"
        THEN 'Organic Social'

        WHEN 
          ${source} IN ('sfmc')
          AND ${campaign} LIKE "%_DM_%"
        THEN 'Email DEM'

        WHEN 
          REGEXP_CONTAINS(${source}, r'^(email|mail|e-mail|e_mail|e mail|mail\.google\.com)$')
          OR REGEXP_CONTAINS(${medium}, r'^(email|mail|e-mail|e_mail|e mail)$') 
        THEN 'Email'

        WHEN 
          ${category} = "SOURCE_CATEGORY_SEARCH"
          OR ${medium} = 'organic' 
        THEN 'Organic Search'

        WHEN 
          ${medium} IN ('affiliate','affiliates') 
        THEN 'Affiliate'

        WHEN 
          ${source} IN ('drtv') 
        THEN 'DRTV'

        WHEN 
          ${source} IN ('print') 
        THEN 'Print'
        
        WHEN 
          ${medium} = 'referral' 
        THEN 'Referral'

        WHEN 
          ${medium} = 'audio' 
        THEN 'Audio'

        WHEN 
          ${medium} = 'sms' 
        THEN 'SMS'

        WHEN 
          (${source} = 'direct' 
            OR ${source} IS NULL) 
          AND (REGEXP_CONTAINS(${medium}, r'^(\(not set\)|\(none\))$') 
              OR ${medium} IS NULL) 
        THEN 'Direct'

        WHEN 
          ENDS_WITH(${medium}, 'push') 
          OR REGEXP_CONTAINS(${medium}, r'.*(mobile|notification).*') 
        THEN 'Mobile Push'
      
        ELSE
        'Other'

      END`
}

function map_transaction_type(source, medium, campaign) {

    return `
      CASE

        WHEN 
          ${campaign} LIKE "%_Monthly_%" OR ${campaign} LIKE "%_PADD_%" 
        THEN 'pledge'

        WHEN 
          ${campaign} LIKE "%_Fundraising_%" 
        THEN 'cash'

        ELSE NULL

      END`
}

module.exports = {
    custom_channel_grouping,
    map_transaction_type
}
