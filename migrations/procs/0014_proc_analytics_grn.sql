-- Active: 1729315865592@@159.203.30.12@3306@inventory_db
DROP PROCEDURE IF EXISTS analytics_grn;

CREATE PROCEDURE `analytics_grn`(
    IN startDate_in DATE,
    IN endDate_in DATE
)
BEGIN

    DROP Table IF EXISTS analytics_inventory_db.temp_grn_test;
    DROP Table IF EXISTS analytics_inventory_db.temp_final_test_grn;

    -- Create a temp table to target the necessary columns
    CREATE TABLE analytics_inventory_db.temp_grn_test AS 
    SELECT 
        sale_order_id,
        JSON_EXTRACT(invoice_items, '$[0].tax_amount') AS tax_amount,
        JSON_EXTRACT(invoice_items, '$[0].discount_amount') AS discount_amount,
        JSON_EXTRACT(invoice_items, '$[0].taxable_amount') AS taxable_amount,
        total_amount,
        total_amount_after_tax,
        DATE(grn_date) AS date_v 
    FROM 
        latest_grn
    WHERE 
        DATE(grn_date) >= startDate_in
        AND DATE(grn_date) <= endDate_in;

    CREATE TABLE analytics_inventory_db.temp_final_test_grn as 
    SELECT 
        UUID() as analytics_grn_uuid,
        sum(t_inv.tax_amount) as sum_total_tax_amount,
        sum(t_inv.discount_amount) as sum_total_discount_amount,
        sum(t_inv.taxable_amount) as sum_total_taxable_amount,
        sum(t_inv.total_amount_after_tax) as sum_total_amount_after_tax,
        sum(t_inv.total_amount) as sum_total_amount,
        t_inv.date_v as start_date
        FROM
         analytics_inventory_db.temp_grn_test t_inv
        GROUP BY t_inv.date_v
        ORDER BY t_inv.date_v;

    DELETE
        FROM
        analytics_inventory_db.analytics_grn
        WHERE
        start_date IN (SELECT start_date from analytics_inventory_db.temp_final_test_grn);

    -- Inserting data into Analytics table
    INSERT INTO analytics_inventory_db.analytics_grn (
        calendar_id,
        analytics_grn_uuid,
        start_date,
        sum_total_tax_amount,
        sum_total_discount_amount,
        sum_total_taxable_amount,
        sum_total_amount_after_tax,
        sum_total_amount
        ) 
        SELECT 
        cal.calendar_id,
        temp.analytics_grn_uuid,
        temp.start_date,
        temp.sum_total_tax_amount,
        temp.sum_total_discount_amount,
        temp.sum_total_taxable_amount,
        temp.sum_total_amount_after_tax,
        temp.sum_total_amount
        FROM analytics_inventory_db.temp_final_test_grn temp 
        INNER JOIN analytics_inventory_db.Calendar cal on cal.CalendarDate = temp.start_date;
    
END