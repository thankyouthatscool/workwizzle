import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";

import type {
  AppSliceInitialState,
  DbMonthData,
  SelectedDateInformation,
  TouchedDateInformation,
} from "@types";
import { getCurrentDateInformation } from "@utils";

const {
  CURRENT_DATE,
  CURRENT_WEEK_DAY,
  CURRENT_WEEK_DAY_LONG,
  CURRENT_MONTH,
  CURRENT_MONTH_LONG,
  CURRENT_YEAR,
} = getCurrentDateInformation();

const initialState: AppSliceInitialState = {
  currentDateInformation: {
    CURRENT_DATE,
    CURRENT_WEEK_DAY,
    CURRENT_MONTH_LONG,
    CURRENT_MONTH,
    CURRENT_WEEK_DAY_LONG,
    CURRENT_YEAR,
  },
  databaseInstance: SQLite.openDatabase("dayTracker.db"),
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
    // DB Month  Data
    setDbMonthData: (state, { payload }: PayloadAction<DbMonthData[]>) => {
      state.dbMonthData = payload;
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
  // Db Month Data
  setDbMonthData,

  // Selected Date Information
  setSelectedDateInformation,

  // Touched Date Information
  setTouchedDateInformation,
} = appSlice.actions;
