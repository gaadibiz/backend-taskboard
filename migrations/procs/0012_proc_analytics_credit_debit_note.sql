-- Active: 1711945541933@@139.59.14.80@3306
DROP PROCEDURE analytics_credit_debit_note;
CREATE PROCEDURE `analytics_credit_debit_note`(
    IN startDate_in DATE,
    IN endDate_in DATE
)
BEGIN
    -- Drop temp tables if they exist
    DROP TABLE IF EXISTS analytics_inventory_db.temp_cdn_test;
    DROP TABLE IF EXISTS analytics_inventory_db.temp_final_test_cdn;

    -- Create a temp table to target the necessary columns
    CREATE TABLE analytics_inventory_db.temp_cdn_test AS 
    SELECT 
        credit_debit_note_id,
        JSON_UNQUOTE(JSON_EXTRACT(invoice_items, '$[0].tax_amount')) AS tax_amount,
        JSON_UNQUOTE(JSON_EXTRACT(invoice_items, '$[0].discount_amount')) AS discount_amount,
        JSON_UNQUOTE(JSON_EXTRACT(invoice_items, '$[0].taxable_amount')) AS taxable_amount,
        total_value,
        DATE(credit_debit_note_date) AS date_v 
    FROM 
        latest_credit_debit_note
    WHERE 
        DATE(credit_debit_note_date) >= startDate_in
        AND DATE(credit_debit_note_date) <= endDate_in;

    -- Create the final temp table with aggregated data
    CREATE TABLE analytics_inventory_db.temp_final_test_cdn AS
    SELECT 
        UUID() AS analytics_cdn_uuid,
        SUM(CAST(t_inv.tax_amount AS DECIMAL(18,2))) AS sum_total_tax_amount,
        SUM(CAST(t_inv.discount_amount AS DECIMAL(18,2))) AS sum_total_discount_amount,
        SUM(CAST(t_inv.taxable_amount AS DECIMAL(18,2))) AS sum_total_taxable_amount,
        SUM(t_inv.total_value) AS sum_total_value,
        t_inv.date_v AS start_date
    FROM
        analytics_inventory_db.temp_cdn_test t_inv
    GROUP BY 
        t_inv.date_v;

    -- Delete existing data from the analytics table for the selected dates
    DELETE
    FROM
        analytics_inventory_db.analytics_cdn
    WHERE
        start_date IN (SELECT start_date FROM analytics_inventory_db.temp_final_test_cdn);

    -- Insert data into the Analytics table
    INSERT INTO analytics_inventory_db.analytics_cdn (
        calendar_id,
        analytics_cdn_uuid,
        start_date,
        sum_total_tax_amount,
        sum_total_discount_amount,
        sum_total_taxable_amount,
        sum_total_value
    ) 
    SELECT 
        cal.calendar_id,
        temp.analytics_cdn_uuid,
        temp.start_date,
        temp.sum_total_tax_amount,
        temp.sum_total_discount_amount,
        temp.sum_total_taxable_amount,
        temp.sum_total_value
    FROM 
        analytics_inventory_db.temp_final_test_cdn temp 
    INNER JOIN 
        analytics_inventory_db.Calendar cal 
    ON 
        cal.CalendarDate = temp.start_date;

END