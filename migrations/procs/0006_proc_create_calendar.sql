-- Active: 1703913639497@@159.203.30.12@3306@analytics_inventory_db
DROP TABLE IF EXISTS Calendar;

CREATE TABLE Calendar (
    calendar_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CalendarDate DATE,
    CalendarDay VARCHAR(10),
    CalendarMonth VARCHAR(10),
    CalendarQuarter VARCHAR(10),
    CalendarYear VARCHAR(10),
    DayOfWeekNum VARCHAR(10),
    DayOfWeekName VARCHAR(10),
    DateNum VARCHAR(10),
    QuarterCD VARCHAR(10),
    MonthNameCD VARCHAR(10),
    FullMonthName VARCHAR(10),
    HolidayName VARCHAR(50),
    HolidayFlag VARCHAR(10)
);

DELIMITER //

DROP PROCEDURE IF EXISTS `GenerateCalendar`;
CREATE PROCEDURE GenerateCalendar(IN StartDateParam DATE, IN EndDateParam DATE)
BEGIN
    DECLARE StartDate DATE;
    DECLARE EndDate DATE;

    SET StartDate = StartDateParam;
    SET EndDate = EndDateParam;

    WHILE StartDate <= EndDate DO
        INSERT INTO Calendar (
            CalendarDate,
            CalendarDay,
            CalendarMonth,
            CalendarQuarter,
            CalendarYear,
            DayOfWeekNum,
            DayOfWeekName,
            DateNum,
            QuarterCD,
            MonthNameCD,
            FullMonthName,
            HolidayName,
            HolidayFlag
        )
        VALUES (
            StartDate,
            DAY(StartDate),
            MONTH(StartDate),
            QUARTER(StartDate),
            YEAR(StartDate),
            DAYOFWEEK(StartDate),
            DAYNAME(StartDate),
            DATE_FORMAT(StartDate, '%Y%m%d'),
            CONCAT(YEAR(StartDate), 'Q', QUARTER(StartDate)),
            LEFT(MONTHNAME(StartDate), 3),
            MONTHNAME(StartDate),
            NULL,
            'N'
        );

        SET StartDate = DATE_ADD(StartDate, INTERVAL 1 DAY);
    END WHILE;
END//

DELIMITER ;

CALL GenerateCalendar('2024-04-01', '2025-03-31');
