import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";

import {
  DEFAULT_BREAK_DURATION,
  DEFAULT_COMMENT,
  DEFAULT_DAILY_HOURS,
  DEFAULT_HOURLY_RATE,
  DEFAULT_WEEKLY_HOURS,
} from "@constants";
import {
  AppDefaults,
  AppState,
  CurrentDateInformation,
  DbMonthData,
  SelectedDateInformation,
  TouchedDateInformation,
} from "@types";
import { getCurrentDateInformation } from "@utils";

const {
  CURRENT_DATE,
  CURRENT_MONTH,
  CURRENT_MONTH_LONG,
  CURRENT_YEAR,
  CURRENT_MONTH_FIRST_DAY,
  CURRENT_MONTH_LAST_DAY,
  CURRENT_MONTH_NUMBER_OF_DAYS,
  CURRENT_WEEK_DAY,
  CURRENT_WEEK_DAY_LONG,
} = getCurrentDateInformation();

const initialState: AppState = {
  appSettings: {
    appDefaults: {
      DEFAULT_BREAK_DURATION,
      DEFAULT_COMMENT,
      DEFAULT_HOURLY_RATE,
      DEFAULT_DAILY_HOURS,
      DEFAULT_WEEKLY_HOURS,
    },
  },
  currentDateInformation: {
    CURRENT_DATE,
    CURRENT_MONTH,
    CURRENT_MONTH_FIRST_DAY,
    CURRENT_MONTH_LAST_DAY,
    CURRENT_MONTH_LONG,
    CURRENT_MONTH_NUMBER_OF_DAYS,
    CURRENT_WEEK_DAY,
    CURRENT_WEEK_DAY_LONG,
    CURRENT_YEAR,
  },
  databaseInstance: SQLite.openDatabase("work-tracker.db"),
  dbMonthData: [],
  selectedDateInformation: {
    SELECTED_DATE: CURRENT_DATE,
    SELECTED_MONTH: CURRENT_MONTH,
    SELECTED_YEAR: CURRENT_YEAR,
  },
  touchedDateInformation: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // App Defaults
    setAppDefaults: (state, { payload }: PayloadAction<AppDefaults>) => {
      state.appSettings.appDefaults = payload;
    },

    // DB Month Data
    setDbMonthData: (state, { payload }: PayloadAction<DbMonthData[]>) => {
      state.dbMonthData = payload;
    },

    // Current Date Information
    setCurrentDateInformation: (
      state,
      { payload }: PayloadAction<CurrentDateInformation>
    ) => {
      state.currentDateInformation = payload;
    },

    // Selected Date Information
    setSelectedDateInformation: (
      state,
      { payload }: PayloadAction<SelectedDateInformation>
    ) => {
      state.selectedDateInformation = payload;
    },

    // Touched Date Information
    setTouchedDateInformation: (
      state,
      { payload }: PayloadAction<TouchedDateInformation>
    ) => {
      state.touchedDateInformation = payload;
    },
  },
});

export const {
  // App Defaults
  setAppDefaults,

  // DB Month Data
  setDbMonthData,

  // Current Date Information
  setCurrentDateInformation,

  // Selected Date Information
  setSelectedDateInformation,

  // Touched Date Information
  setTouchedDateInformation,
} = appSlice.actions;
