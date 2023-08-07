import * as SQLite from "expo-sqlite";

export type AppSliceInitialState = {
  appSettings: AppSettings;
  currentDateInformation: CurrentDateInformation;
  databaseInstance: SQLite.SQLiteDatabase;
  dbMonthData: DbMonthData[];
  isInitialLoad: boolean;
  selectedDateInformation: SelectedDateInformation;
  touchedDateInformation: TouchedDateInformation;
};

export type CurrentDateInformation = {
  CURRENT_DATE: number;
  CURRENT_WEEK_DAY: number;
  CURRENT_WEEK_DAY_LONG: string;
  CURRENT_MONTH: number;
  CURRENT_MONTH_LONG: string;
  CURRENT_YEAR: number;
};

export type SelectedDateInformation = {
  SELECTED_DATE: number;
  SELECTED_MONTH: number;
  SELECTED_YEAR: number;
};

export type TouchedDateInformation = {
  TOUCHED_DATE: number;
  TOUCHED_MONTH: number;
  TOUCHED_YEAR: number;
} | null;

export type DbMonthData = {
  dayId: string;
  monthId: string;
  hoursWorked: string;
  hourlyRate: string;
  comment: string;
};

export type AppSettings = {
  appDefaults: AppDefaults;
};

export type AppDefaults = {
  DEFAULT_COMMENT: string;
  DEFAULT_DAILY_WORK_HOURS: string;
  DEFAULT_HOURLY_RATE: string;
};
