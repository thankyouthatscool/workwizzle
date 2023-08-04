import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";

import type { AppSliceInitialState, SelectedDateInformation } from "@types";
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
  selectedDateInformation: {
    SELECTED_DATE: CURRENT_DATE,
    SELECTED_MONTH: CURRENT_MONTH,
    SELECTED_YEAR: CURRENT_YEAR,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Selected Date Information
    setSelectedDateInformation: (
      state,
      { payload }: PayloadAction<SelectedDateInformation>
    ) => {
      state.selectedDateInformation = payload;
    },
  },
});

export const {
  // Selected Date Information
  setSelectedDateInformation,
} = appSlice.actions;
