-- Active: 1703913639497@@159.203.30.12@3306@inventory_db
DROP PROCEDURE IF EXISTS analytics_purchase_invoice;

CREATE PROCEDURE `analytics_purchase_invoice`(
    IN startDate_in DATE,
    IN endDate_in DATE
)
BEGIN

    DROP Table IF EXISTS analytics_inventory_db.temp_pur_inv_test;
    DROP Table IF EXISTS analytics_inventory_db.temp_final_test_pur_invoice;

    -- Create a temp table to target the necessary columns
    CREATE TABLE analytics_inventory_db.temp_pur_inv_test AS 
    SELECT 
        inventory_id,
        JSON_EXTRACT(products, '$[0].tax_amount') AS tax_amount,
        JSON_EXTRACT(products, '$[0].discount_amount') AS discount_amount,
        JSON_EXTRACT(products, '$[0].taxable_amount') AS taxable_amount,
        total_amount_after_tax,
        DATE(dated) AS date_v 
    FROM 
        latest_inventory
    WHERE 
        DATE(dated) >= startDate_in
        AND DATE(dated) <= endDate_in;

    CREATE TABLE analytics_inventory_db.temp_final_test_pur_invoice as 
    SELECT 
        UUID() as analytics_purchase_invoice_uuid,
        sum(t_inv.tax_amount) as sum_total_tax_amount,
        sum(t_inv.discount_amount) as sum_total_discount_amount,
        sum(t_inv.taxable_amount) as sum_total_taxable_amount,
        sum(t_inv.total_amount_after_tax) as sum_total_amount_after_tax,
        t_inv.date_v as start_date
        FROM
         analytics_inventory_db.temp_pur_inv_test t_inv
        GROUP BY t_inv.date_v
        ORDER BY t_inv.date_v;

    DELETE
        FROM
        analytics_inventory_db.analytics_purchase_invoice
        WHERE
        start_date IN (SELECT start_date from analytics_inventory_db.temp_final_test_pur_invoice);

    -- Inserting data into Analytics table
    INSERT INTO analytics_inventory_db.analytics_purchase_invoice (
        calendar_id,
        analytics_purchase_invoice_uuid,
        start_date,
        sum_total_tax_amount,
        sum_total_discount_amount,
        sum_total_taxable_amount,
        sum_total_amount_after_tax
        ) 
        SELECT 
        cal.calendar_id,
        temp.analytics_purchase_invoice_uuid,
        temp.start_date,
        temp.sum_total_tax_amount,
        temp.sum_total_discount_amount,
        temp.sum_total_taxable_amount,
        temp.sum_total_amount_after_tax
        FROM analytics_inventory_db.temp_final_test_pur_invoice temp 
        INNER JOIN analytics_inventory_db.Calendar cal on cal.CalendarDate = temp.start_date;
    
END