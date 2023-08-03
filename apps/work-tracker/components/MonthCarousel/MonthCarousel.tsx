import type { FC } from "react";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setTouchedDateInformation } from "@store";
import { colors, DEFAULT_APP_PADDING } from "@theme";
import { MonthCarouselNavProps } from "@types";
import { getMonthInformation } from "@utils";

import { CalendarWrapper, MainWrapper, WeekdayHeaderWrapper } from "./Styled";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const MonthCarousel: FC<{ nav: MonthCarouselNavProps }> = ({
  nav: { goBack, navigate },
}) => {
  const dispatch = useAppDispatch();

  const {
    appSettings: {
      appDefaults: { DEFAULT_DAILY_HOURS },
    },
    currentDateInformation: { CURRENT_DATE, CURRENT_MONTH, CURRENT_YEAR },
    dbMonthData,
    selectedDateInformation: { SELECTED_MONTH, SELECTED_YEAR },
    touchedDateInformation,
  } = useAppSelector(({ app }) => app);

  const [selectedMonthInformation, setSelectedMonthInformation] = useState<
    ReturnType<typeof getMonthInformation>
  >(() => getMonthInformation(SELECTED_YEAR, SELECTED_MONTH));

  useEffect(() => {
    setSelectedMonthInformation(() =>
      getMonthInformation(SELECTED_YEAR, SELECTED_MONTH)
    );
  }, [SELECTED_MONTH, SELECTED_YEAR]);

  return (
    <MainWrapper>
      <WeekdayHeaderWrapper>
        {["M", "T", "W", "T", "F", "S", "S"].map((letter, idx) => (
          <View
            key={idx}
            style={{
              alignItems: "center",
              borderRadius: 50,
              height: WINDOW_WIDTH / 7,
              justifyContent: "center",
              width: WINDOW_WIDTH / 7,
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: idx >= 5 ? colors.walledGreen : "white",
                borderColor: colors.walledGreen,
                borderWidth: 2,
                padding: DEFAULT_APP_PADDING / 2,
                borderRadius: 5,
                width: (WINDOW_WIDTH - DEFAULT_APP_PADDING ** 2) / 7,
              }}
            >
              <Text
                style={{
                  color: idx >= 5 ? "white" : colors.walledGreen,
                  fontWeight: "bold",
                }}
              >
                {letter}
              </Text>
            </View>
          </View>
        ))}
      </WeekdayHeaderWrapper>
      <CalendarWrapper>
        {Array.from({
          length:
            selectedMonthInformation.numberOfDays +
            selectedMonthInformation.firstDayIndex +
            6 -
            selectedMonthInformation.lastDayIndex,
        })
          .map((_, idx) => idx)
          .map((idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                if (
                  idx - selectedMonthInformation.firstDayIndex >= 0 &&
                  idx - selectedMonthInformation.firstDayIndex <
                    selectedMonthInformation.numberOfDays
                ) {
                  const NEW_SELECTED_DATE =
                    idx + 1 - selectedMonthInformation.firstDayIndex;

                  dispatch(
                    setTouchedDateInformation({
                      TOUCHED_DATE: NEW_SELECTED_DATE,
                      TOUCHED_MONTH:
                        touchedDateInformation?.TOUCHED_MONTH || SELECTED_MONTH,
                      TOUCHED_YEAR:
                        touchedDateInformation?.TOUCHED_YEAR || SELECTED_YEAR,
                    })
                  );

                  navigate("TouchedDateScreen");
                }
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: !!dbMonthData.find(
                    (record) =>
                      record.dayId ===
                      `${
                        idx + 1 - selectedMonthInformation.firstDayIndex
                      }/${SELECTED_MONTH}/${SELECTED_YEAR}`
                  )
                    ? dbMonthData
                        .find(
                          (record) =>
                            record.dayId ===
                            `${
                              idx + 1 - selectedMonthInformation.firstDayIndex
                            }/${SELECTED_MONTH}/${SELECTED_YEAR}`
                        )
                        ?.hoursWorked.reduce((acc, val) => acc + val, 0) !==
                      parseInt(DEFAULT_DAILY_HOURS)
                      ? colors.artisanGold
                      : colors.walledGreen
                    : "white",
                  borderRadius: 50,
                  borderColor:
                    `${
                      idx + 1 - selectedMonthInformation.firstDayIndex
                    }/${SELECTED_MONTH}/${SELECTED_YEAR}` ===
                    `${CURRENT_DATE}/${CURRENT_MONTH}/${CURRENT_YEAR}`
                      ? colors.forbiddenBlackberry
                      : "white",
                  borderWidth:
                    `${
                      idx + 1 - selectedMonthInformation.firstDayIndex
                    }/${SELECTED_MONTH}/${SELECTED_YEAR}` ===
                    `${CURRENT_DATE}/${CURRENT_MONTH}/${CURRENT_YEAR}`
                      ? 2
                      : 1,
                  height: WINDOW_WIDTH / 7,
                  justifyContent: "center",
                  width: WINDOW_WIDTH / 7,
                }}
              >
                {idx < selectedMonthInformation.firstDayIndex ||
                idx - selectedMonthInformation.firstDayIndex >=
                  selectedMonthInformation.numberOfDays ? (
                  <View />
                ) : (
                  <Text
                    style={{
                      color: !!dbMonthData.find(
                        (record) =>
                          record.dayId ===
                          `${
                            idx + 1 - selectedMonthInformation.firstDayIndex
                          }/${SELECTED_MONTH}/${SELECTED_YEAR}`
                      )
                        ? "white"
                        : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {idx + 1 - selectedMonthInformation.firstDayIndex}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
      </CalendarWrapper>
    </MainWrapper>
  );
};
