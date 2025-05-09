-- Active: 1703913639497@@159.203.30.12@3306@inventory_db
DROP PROCEDURE IF EXISTS analytics_proforma_invoice;

CREATE PROCEDURE `analytics_proforma_invoice`(
    IN startDate_in DATE,
    IN endDate_in DATE
)
BEGIN

    DROP Table IF EXISTS analytics_inventory_db.temp_proforma_inv_test;
    DROP Table IF EXISTS analytics_inventory_db.temp_final_test_proforma_invoice;

    -- Create a temp table to target the necessary columns
    CREATE TABLE analytics_inventory_db.temp_proforma_inv_test AS 
    SELECT 
        proforma_invoice_id,
        JSON_EXTRACT(invoice_items, '$[0].tax_amount') AS tax_amount,
        JSON_EXTRACT(invoice_items, '$[0].discount_amount') AS discount_amount,
        JSON_EXTRACT(invoice_items, '$[0].taxable_amount') AS taxable_amount,
        total_amount,
        total_amount_after_tax,
        DATE(proforma_invoice_date) AS date_v 
    FROM 
        latest_proforma_invoices
    WHERE 
        DATE(proforma_invoice_date) >= startDate_in
        AND DATE(proforma_invoice_date) <= endDate_in;

    CREATE TABLE analytics_inventory_db.temp_final_test_proforma_invoice as 
    SELECT 
        UUID() as analytics_proforma_invoice_uuid,
        sum(t_inv.tax_amount) as sum_total_tax_amount,
        sum(t_inv.discount_amount) as sum_total_discount_amount,
        sum(t_inv.taxable_amount) as sum_total_taxable_amount,
        sum(t_inv.total_amount_after_tax) as sum_total_amount_after_tax,
        sum(t_inv.total_amount) as sum_total_amount,
        t_inv.date_v as start_date
        FROM
         analytics_inventory_db.temp_proforma_inv_test t_inv
        GROUP BY t_inv.date_v
        ORDER BY t_inv.date_v;

    DELETE
        FROM
        analytics_inventory_db.analytics_proforma_invoice
        WHERE
        start_date IN (SELECT start_date from analytics_inventory_db.temp_final_test_proforma_invoice);

    -- Inserting data into Analytics table
    INSERT INTO analytics_inventory_db.analytics_proforma_invoice (
        calendar_id,
        analytics_proforma_invoice_uuid,
        start_date,
        sum_total_tax_amount,
        sum_total_discount_amount,
        sum_total_taxable_amount,
        sum_total_amount_after_tax,
        sum_total_amount
        ) 
        SELECT 
        cal.calendar_id,
        temp.analytics_proforma_invoice_uuid,
        temp.start_date,
        temp.sum_total_tax_amount,
        temp.sum_total_discount_amount,
        temp.sum_total_taxable_amount,
        temp.sum_total_amount_after_tax,
        temp.sum_total_amount
        FROM analytics_inventory_db.temp_final_test_proforma_invoice temp 
        INNER JOIN analytics_inventory_db.Calendar cal on cal.CalendarDate = temp.start_date;
    
END