-- Active: 1711945541933@@139.59.14.80@3306@inventorywesourcebe
DROP PROCEDURE IF EXISTS analytics_sales_invoice;

CREATE PROCEDURE `analytics_sales_invoice`(
    IN startDate_in DATE,
    IN endDate_in DATE
)
BEGIN
    DROP Table IF EXISTS analytics_inventory_db.temp_inv_test;
    DROP Table IF EXISTS analytics_inventory_db.temp_final_test_invoice;

    -- Create a temp table to target the necessary columns
    CREATE TABLE analytics_inventory_db.temp_inv_test AS 
    SELECT 
        invoice_id,
        JSON_EXTRACT(invoice_items, '$[0].tax_amount') AS tax_amount,
        JSON_EXTRACT(invoice_items, '$[0].discount_amount') AS discount_amount,
        JSON_EXTRACT(invoice_items, '$[0].taxable_amount') AS taxable_amount,
        total_amount,
        total_amount_after_tax,
        DATE(invoice_date) AS date_v 
    FROM 
        latest_invoices
    WHERE 
        DATE(invoice_date) >= startDate_in
        AND DATE(invoice_date) <= endDate_in;

    CREATE TABLE analytics_inventory_db.temp_final_test_invoice as 
    SELECT 
        UUID() as analytics_invoice_uuid,
        sum(t_inv.tax_amount) as sum_total_tax_amount,
        sum(t_inv.discount_amount) as sum_total_discount_amount,
        sum(t_inv.taxable_amount) as sum_total_taxable_amount,
        sum(t_inv.total_amount_after_tax) as sum_total_amount_after_tax,
        sum(t_inv.total_amount) as sum_total_amount,
        t_inv.date_v as start_date
        FROM
         analytics_inventory_db.temp_inv_test t_inv
        GROUP BY t_inv.date_v
        ORDER BY t_inv.date_v;

    DELETE
        FROM
        analytics_inventory_db.analytics_sales_invoice
        WHERE
        start_date IN (SELECT start_date from analytics_inventory_db.temp_final_test_invoice);

    -- Inserting data into Analytics table
    INSERT INTO analytics_inventory_db.analytics_sales_invoice (
        calendar_id,
        analytics_invoice_uuid,
        start_date,
        sum_total_tax_amount,
        sum_total_discount_amount,
        sum_total_taxable_amount,
        sum_total_amount_after_tax,
        sum_total_amount
        ) 
        SELECT 
        cal.calendar_id,
        temp.analytics_invoice_uuid,
        temp.start_date,
        temp.sum_total_tax_amount,
        temp.sum_total_discount_amount,
        temp.sum_total_taxable_amount,
        temp.sum_total_amount_after_tax,
        temp.sum_total_amount
        FROM analytics_inventory_db.temp_final_test_invoice temp 
        INNER JOIN analytics_inventory_db.Calendar cal on cal.CalendarDate = temp.start_date;
    
END