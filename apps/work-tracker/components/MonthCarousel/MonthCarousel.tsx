import { type FC, useEffect, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector, useDateHooks } from "@hooks";
import { COLORS, DEFAULT_APP_PADDING } from "@theme";
import { setDbMonthData, setTouchedDateInformation } from "@store";
import type { MonthCarouselScreenProps } from "@types";
import { getDayOfYear, getMonthInformation, monthNameLookup } from "@utils";

import { CalendarWrapper, WeekdayWrapper } from "./Styled";
import {
  DEFAULT_COMMENT,
  DEFAULT_DAILY_WORK_HOURS,
  DEFAULT_HOURLY_RATE,
} from "@constants";
import { getWeek } from "date-fns";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const MonthCarousel: FC<MonthCarouselScreenProps> = ({ navigation }) => {
  // Hooks
  const dispatch = useAppDispatch();

  const {
    currentDateInformation: {
      CURRENT_DATE,
      CURRENT_WEEK_DAY,
      CURRENT_WEEK_DAY_LONG,
      CURRENT_MONTH,
      CURRENT_MONTH_LONG,
      CURRENT_YEAR,
    },
    databaseInstance: db,
    dbMonthData,
    selectedDateInformation: { SELECTED_MONTH, SELECTED_YEAR },
  } = useAppSelector(({ app }) => app);

  const { changeSelectedDate } = useDateHooks();

  // Local State
  const [
    { firstDayIndex, lastDayIndex, monthNameLong, numberOfDays },
    setSelectedMonthInformation,
  ] = useState<ReturnType<typeof getMonthInformation>>(() =>
    getMonthInformation(SELECTED_YEAR, SELECTED_MONTH)
  );

  // Effects
  useEffect(() => {
    setSelectedMonthInformation(() =>
      getMonthInformation(SELECTED_YEAR, SELECTED_MONTH)
    );
  }, [SELECTED_MONTH, SELECTED_YEAR]);

  useEffect(() => {
    if ((!!SELECTED_MONTH || SELECTED_MONTH === 0) && !!SELECTED_YEAR) {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `
              SELECT * FROM dayTracker
              WHERE monthId = ?
          `,
            [`${monthNameLookup(SELECTED_MONTH)}-${SELECTED_YEAR}`],
            (_, { rows: { _array } }) => {
              dispatch(setDbMonthData(_array));
            }
          );
        },
        (err) => console.log(err),
        () => {}
      );
    }
  }, [SELECTED_MONTH, SELECTED_YEAR]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Text>
        {CURRENT_WEEK_DAY_LONG}, {CURRENT_MONTH_LONG} {CURRENT_DATE},{" "}
        {CURRENT_YEAR}
      </Text>
      <Text>
        {monthNameLookup(SELECTED_MONTH)} {SELECTED_YEAR}
      </Text>
      <WeekdayWrapper>
        {["M", "T", "W", "T", "F", "S", "S"].map((weekDayLetter, idx) => (
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
                backgroundColor: idx >= 5 ? COLORS.walledGreen : "white",
                borderColor: COLORS.walledGreen,
                borderWidth: 2,
                padding: DEFAULT_APP_PADDING / 2,
                borderRadius: 5,
                width: (WINDOW_WIDTH - DEFAULT_APP_PADDING ** 2) / 7,
              }}
            >
              <Text
                style={{
                  color: idx >= 5 ? "white" : COLORS.walledGreen,
                  fontWeight: "bold",
                }}
              >
                {weekDayLetter}
              </Text>
            </View>
          </View>
        ))}
      </WeekdayWrapper>
      <CalendarWrapper>
        {Array.from({ length: numberOfDays + firstDayIndex + 6 - lastDayIndex })
          .map((_, idx) => idx)
          .map((idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                if (
                  idx + 1 - firstDayIndex > 0 &&
                  idx + 1 - firstDayIndex <= numberOfDays
                ) {
                  navigation.navigate("TouchedDayScreen");

                  dispatch(
                    setTouchedDateInformation({
                      TOUCHED_DATE: idx + 1 - firstDayIndex,
                      TOUCHED_MONTH: SELECTED_MONTH,
                      TOUCHED_YEAR: SELECTED_YEAR,
                    })
                  );
                }
              }}
              onLongPress={() => {
                if (
                  idx + 1 - firstDayIndex > 0 &&
                  idx + 1 - firstDayIndex <= numberOfDays
                ) {
                  const weekId = `${getWeek(
                    new Date(
                      `${SELECTED_YEAR}-${SELECTED_MONTH + 1}-${
                        idx + 1 - firstDayIndex
                      }`
                    ),
                    { weekStartsOn: 1 }
                  )}-${SELECTED_YEAR}`;

                  db.transaction(
                    (tx) => {
                      tx.executeSql(
                        `
                          INSERT INTO dayTracker
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                          ON CONFLICT (dayId) DO UPDATE SET
                            weekId = excluded.weekId,
                            monthId = excluded.monthId,
                            hoursWorked = excluded.hoursWorked,
                            hourlyRate = excluded.hourlyRate,
                            startTime = excluded.startTime,
                            endTime = excluded.endTime,
                            comment = excluded.comment
                        `,
                        [
                          `${idx + 1 - firstDayIndex}-${monthNameLookup(
                            SELECTED_MONTH
                          )}-${SELECTED_YEAR}`,
                          weekId,
                          `${monthNameLookup(SELECTED_MONTH)}-${SELECTED_YEAR}`,
                          DEFAULT_DAILY_WORK_HOURS,
                          DEFAULT_HOURLY_RATE,
                          "",
                          "",
                          DEFAULT_COMMENT,
                        ]
                      );
                    },
                    (err) => console.log(err),
                    () => {
                      db.transaction(
                        (tx) => {
                          tx.executeSql(
                            `
                              SELECT * FROM dayTracker
                              WHERE monthId = ?
                            `,
                            [
                              `${monthNameLookup(
                                SELECTED_MONTH
                              )}-${SELECTED_YEAR}`,
                            ],
                            (_, { rows: { _array } }) => {
                              dispatch(setDbMonthData(_array));
                            }
                          );
                        },
                        (err) => console.log(err),
                        () => {}
                      );
                    }
                  );
                }
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: !!dbMonthData.find(
                    (record) =>
                      record.dayId ===
                      `${idx + 1 - firstDayIndex}-${monthNameLookup(
                        SELECTED_MONTH
                      )}-${SELECTED_YEAR}`
                  )
                    ? COLORS.artisanGold
                    : "#00000000",
                  borderRadius: 50,
                  borderColor:
                    `${
                      idx + 1 - firstDayIndex
                    }/${SELECTED_MONTH}/${SELECTED_YEAR}` ===
                    `${CURRENT_DATE}/${CURRENT_MONTH}/${CURRENT_YEAR}`
                      ? COLORS.walledGreen
                      : "#00000000",
                  borderWidth: 2,
                  height: WINDOW_WIDTH / 7,
                  justifyContent: "center",
                  width: WINDOW_WIDTH / 7,
                }}
              >
                {idx < firstDayIndex || idx - firstDayIndex >= numberOfDays ? (
                  ""
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {idx + 1 - firstDayIndex}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
      </CalendarWrapper>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <Button
          mode="contained"
          onPress={() => {
            changeSelectedDate("prev");
          }}
        >
          Prev
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            changeSelectedDate("today");
          }}
        >
          Today
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            changeSelectedDate("next");
          }}
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};
