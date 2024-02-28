DROP PROCEDURE IF EXISTS session_handler;
CREATE PROCEDURE session_handler(
    IN user_uuid_arg VARCHAR(50),
    IN access_token_arg VARCHAR(5000)
)
BEGIN
    DECLARE is_user_exist int DEFAULT 0;

    SELECT COUNT(1) INTO is_user_exist FROM user_session WHERE user_uuid=user_uuid_arg ORDER BY insert_ts limit 1;

    IF is_user_exist=0 THEN
        
        INSERT INTO user_session (user_uuid,access_token) VALUES (user_uuid_arg,access_token_arg);

    ELSE

        UPDATE user_session SET access_token=access_token_arg WHERE user_uuid=user_uuid_arg;

    END IF;
    
    
END;