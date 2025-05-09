-- Active: 1703913639497@@159.203.30.12@3306@inventory_db
drop procedure IF EXISTS proc_insert_ledger;
delimiter #;
CREATE PROCEDURE proc_insert_ledger(
IN invoice_uuid_v varchar(50),
IN product_uuid_v varchar(500),
IN quantity_v int,
IN billing_company_uuid_v varchar(50),
IN customer_name_v varchar(500),
IN type_v varchar(10),
IN invoice_type_v varchar(50)
)
BEGIN
    DECLARE selling_name_v varchar(50);
    DECLARE invoice_no_v varchar(100);
    DECLARE balance_v float;
	 DECLARE check_product_invoice_present_v int;
	 DECLARE old_quantity_v int;
    DECLARE intentory_type_value_v int;
    DECLARE billing_company_name_v varchar(500);
    
-- get selling name from item_uuid
select product_name into selling_name_v from latest_product where product_uuid=product_uuid_v;
 insert into error_log(error_message) values (selling_name_v);
 
-- get the billing company name from billing_company_uuid
select customer_name into billing_company_name_v from latest_customer where customer_uuid=billing_company_uuid_v;

 insert into error_log(error_message) values (billing_company_name_v);
 
select
case
	when type_v ='IN' then 1
	when type_v='OUT' then -1
    else 0 end into intentory_type_value_v from dual  ;
    
    insert into error_log(error_number,error_message) values (36,intentory_type_value_v);
    
    
    
 --  get invoice_number from invoice_uuid
 if invoice_type_v='credit_debit_note' THEN
 select combined_credit_debit_note_no into invoice_no_v from latest_credit_debit_note where credit_debit_note_uuid=invoice_uuid_v;
 elseif type_v='IN' then
 select combined_grn_no into invoice_no_v from latest_grn where grn_uuid=invoice_uuid_v;
 elseif type_v ='OUT' then
 select combined_delivery_challan_no into invoice_no_v from latest_delivery_challan where delivery_challan_uuid=invoice_uuid_v;
 else
 select 'No Type' into invoice_no_v  from dual;
 end if;
 

 
-- get the balance of the product and manage 0 if product is new
  select balance into balance_v from ledgers where selling_name= selling_name_v and billing_company_uuid= billing_company_uuid_v order by ledger_id desc limit 1;
  select ifnull(balance_v,0) into balance_v from dual;
  
   insert into error_log(error_number,error_message) values (54,balance_v);
   
-- if item name is already present for that invoice that - whole and set status as adjusted and then insert new value
select count(1) into check_product_invoice_present_v from
 ledgers where selling_name= selling_name_v and invoice_no = invoice_no_v and type=type_v and billing_company_uuid= billing_company_uuid_v ;
--   insert into error_log(error_number,error_message) values (59,invoice_no_v);
  
 if check_product_invoice_present_v>0 then
 
 select quantity into old_quantity_v from ledgers
 where selling_name= selling_name_v and invoice_no = invoice_no_v and type=type_v and billing_company_uuid= billing_company_uuid_v order by 1 desc limit 1;
 
    insert into error_log(error_number,error_message) values (66,balance_v);
    insert into error_log(error_number,error_message) values (67,old_quantity_v);
  insert into error_log(error_number,error_message) values (79,customer_name_v);
    insert into error_log(error_number,error_message) values (80,billing_company_name_v);

 insert into ledgers(ledger_uuid, invoice_uuid, product_uuid, selling_name, quantity, invoice_no, billing_company_uuid,
 billing_company_name, balance, customer_name, type, status, create_ts)
 select ledger_uuid, invoice_uuid, product_uuid, selling_name, (quantity)*intentory_type_value_v, invoice_no, billing_company_uuid, billing_company_name_v,
 balance_v-(old_quantity_v*intentory_type_value_v), customer_name, type, 'ADJUSTED', create_ts
 from ledgers where selling_name= selling_name_v and invoice_no = invoice_no_v order by 1 desc limit 1;

    insert into error_log(error_number,error_message) values (76,balance_v-(old_quantity_v*intentory_type_value_v));
    insert into error_log(error_number,error_message) values (78,balance_v-(old_quantity_v*intentory_type_value_v)+(intentory_type_value_v*quantity_v));
    insert into error_log(error_number,error_message) values (79,customer_name_v);
    insert into error_log(error_number,error_message) values (80,billing_company_name_v);
 
 insert into ledgers(ledger_uuid, invoice_uuid, product_uuid, selling_name, quantity, invoice_no, billing_company_uuid,
 billing_company_name, balance, customer_name, type, status, create_ts)
 select ledger_uuid, invoice_uuid, product_uuid, selling_name, quantity_v, invoice_no, billing_company_uuid, billing_company_name_v,
 balance_v-(old_quantity_v*intentory_type_value_v)+(intentory_type_value_v*quantity_v), customer_name, type, 'ACTIVE', create_ts
 from ledgers where selling_name= selling_name_v and invoice_no = invoice_no_v order by 1 desc limit 1; 
 select 'Old entry is deleted and new record submitted' msg, 200 status,invoice_no_v invoice_no from dual;
 
 
 else
 insert into error_log(error_number,error_message) values (89,customer_name_v);
 insert into error_log(error_number,error_message) values (90,billing_company_name_v);
 insert into error_log(error_number,error_message) values (91,intentory_type_value_v);
 -- direct insert
insert into ledgers(ledger_uuid, invoice_uuid, product_uuid, selling_name, quantity, invoice_no, billing_company_uuid,
 billing_company_name, balance, customer_name, type, status, create_ts)
 values(uuid(),invoice_uuid_v, product_uuid_v,selling_name_v,quantity_v,invoice_no_v,billing_company_uuid_v,
 billing_company_name_v,balance_v+(intentory_type_value_v*quantity_v),customer_name_v,type_v,'ACTIVE',current_timestamp());
select 'New entry is submitted' msg, 200 status, invoice_no_v invoice_no from dual;
 end if; 
END;