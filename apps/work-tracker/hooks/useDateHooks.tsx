import { useCallback } from "react";

import { setSelectedDateInformation } from "../store/appSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export const useDateHooks = () => {
  const dispatch = useAppDispatch();

  const {
    currentDateInformation: { CURRENT_DATE, CURRENT_MONTH, CURRENT_YEAR },
    databaseInstance,
    selectedDateInformation: { SELECTED_DATE, SELECTED_MONTH, SELECTED_YEAR },
  } = useAppSelector(({ app }) => app);

  const changeSelectedDate = useCallback(
    (dir: "prev" | "next" | "today") => {
      if (dir === "prev") {
        console.log("going back in time");

        return;
      }

      if (dir === "next") {
        const DATE_STRING = `${SELECTED_YEAR}-${SELECTED_MONTH}-${SELECTED_DATE}`;

        const CURRENT_SELECTED_DATE = new Date(Date.parse(DATE_STRING));

        const newSelectedDate = new Date(
          CURRENT_SELECTED_DATE.setMonth(CURRENT_SELECTED_DATE.getMonth() + 2)
        );

        const NEW_SELECTED_DATE = newSelectedDate.getDate();
        const NEW_SELECTED_MONTH = newSelectedDate.getMonth();
        const NEW_SELECTED_YEAR = newSelectedDate.getFullYear();

        dispatch(
          setSelectedDateInformation({
            SELECTED_DATE: NEW_SELECTED_DATE,
            SELECTED_MONTH: NEW_SELECTED_MONTH,
            SELECTED_YEAR: NEW_SELECTED_YEAR,
          })
        );

        return;
      }

      dispatch(
        setSelectedDateInformation({
          SELECTED_DATE: CURRENT_DATE,
          SELECTED_MONTH: CURRENT_MONTH,
          SELECTED_YEAR: CURRENT_YEAR,
        })
      );

      return;
    },
    [SELECTED_DATE, SELECTED_MONTH, SELECTED_YEAR]
  );

  return { changeSelectedDate };
};
