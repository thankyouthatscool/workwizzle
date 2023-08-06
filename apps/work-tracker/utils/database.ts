// Crate Tables
export const createDefaultTableSQLString = `
CREATE TABLE IF NOT EXISTS dayTracker 
(
    dayId TEXT UNIQUE NOT NULL PRIMARY KEY, 
    monthId TEXT NOT NULL, 
    hoursWorked TEXT NOT NULL, 
    hourlyRate TEXT NOT NULL, 
    startTime TEXT,
    endTime TEXT,
    comment TEXT
)`;

// Drop Tables
export const dropDefaultTableSQLString = "DROP TABLE dayTracker";
