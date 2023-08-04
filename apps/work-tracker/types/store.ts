import * as SQLite from "expo-sqlite";

export type AppSliceInitialState = {
  currentDateInformation: CurrentDateInformation;
  databaseInstance: SQLite.SQLiteDatabase;
  selectedDateInformation: SelectedDateInformation;
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
