import { type FC, useEffect, useState, useRef } from "react";
import { Dimensions, Pressable, View, VirtualizedList } from "react-native";
import { Button, Text, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector, useDateHooks } from "@hooks";
import { COLORS, DEFAULT_APP_PADDING } from "@theme";
import { setDbMonthData, setTouchedDateInformation } from "@store";
import type { MonthCarouselScreenProps } from "@types";
import {
  createDefaultTableSQLString,
  getDayOfYear,
  getMonthInformation,
  monthNameLookup,
  pl,
} from "@utils";

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

  // Refs
  const virtualListRef = useRef<VirtualizedList<{ id: string }>>(null);

  // Global State
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

  const { changeSelectedDate, goToDate } = useDateHooks();

  // Local State
  const [isYearMonthPickerModalOpen, setIsYearMonthPickerModalOpen] =
    useState<boolean>(false);
  const [modalSelectedMonthIndex, setModalSelectedMonthIndex] =
    useState<number>(0);
  const [modalSelectedYear, setModalSelectedYear] = useState(CURRENT_YEAR);
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
      <Portal>
        <Modal
          onDismiss={() => setIsYearMonthPickerModalOpen(() => false)}
          style={{ alignItems: "center" }}
          visible={isYearMonthPickerModalOpen}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              padding: DEFAULT_APP_PADDING,
              height: WINDOW_WIDTH - DEFAULT_APP_PADDING * 2,
              width: WINDOW_WIDTH - DEFAULT_APP_PADDING * 2,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <VirtualizedList
                showsVerticalScrollIndicator={false}
                getItem={(_, idx) =>
                  [
                    { id: "January", idx: 0 },
                    { id: "February", idx: 1 },
                    { id: "March", idx: 2 },
                    { id: "April", idx: 3 },
                    { id: "May", idx: 4 },
                    { id: "June", idx: 5 },
                    { id: "July", idx: 6 },
                    { id: "August", idx: 7 },
                    { id: "September", idx: 8 },
                    { id: "October", idx: 9 },
                    { id: "November", idx: 10 },
                    { id: "December", idx: 11 },
                  ][idx]
                }
                getItemCount={() => 12}
                keyExtractor={({ id }) => id}
                renderItem={({ index, item: { id, idx } }) => (
                  <Pressable
                    onPress={() => setModalSelectedMonthIndex(() => idx)}
                  >
                    <Text
                      style={{
                        color:
                          modalSelectedMonthIndex === index ? "green" : "black",
                      }}
                    >
                      {id}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <VirtualizedList
                showsVerticalScrollIndicator={false}
                getItem={(_, idx) => ({ id: `${CURRENT_YEAR - 5 + idx}` })}
                getItemCount={() => 11}
                keyExtractor={({ id }) => id}
                overScrollMode="never"
                renderItem={({ item: { id } }) => (
                  <Pressable
                    onPress={() => {
                      setModalSelectedYear(() => parseInt(id));
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color:
                          modalSelectedYear === parseInt(id)
                            ? "green"
                            : "black",
                      }}
                      variant="headlineLarge"
                    >
                      {id}
                    </Text>
                  </Pressable>
                )}
              />
              <View style={{ marginTop: DEFAULT_APP_PADDING }}>
                <Button
                  mode="contained"
                  onPress={() => {
                    setIsYearMonthPickerModalOpen(() => false);

                    goToDate(modalSelectedMonthIndex, modalSelectedYear);
                  }}
                >
                  Go To
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
      <Text style={{ textAlign: "center" }} variant="headlineMedium">
        {CURRENT_WEEK_DAY_LONG}, {CURRENT_MONTH_LONG} {CURRENT_DATE},{" "}
        {CURRENT_YEAR}
      </Text>
      <Pressable
        onPress={() => {
          setIsYearMonthPickerModalOpen(() => true);
        }}
      >
        <Text style={{ textAlign: "center" }} variant="titleLarge">
          {monthNameLookup(SELECTED_MONTH)} {SELECTED_YEAR}
        </Text>
      </Pressable>
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
