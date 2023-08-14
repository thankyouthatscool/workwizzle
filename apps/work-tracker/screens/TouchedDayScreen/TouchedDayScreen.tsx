import { useNavigation } from "@react-navigation/native";
import { type FC, useCallback, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { getWeek } from "date-fns";
import { LineChart } from "react-native-chart-kit";

import { HoursWorkedSection } from "@components/HoursWorkedSection";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setDbMonthData } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { TableData, TouchedDayScreenProps } from "@types";
import { getWeekData, monthNameLookup, weekDayNameLookup } from "@utils";

import { ButtonWrapper } from "./Styled";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const TouchedDayScreen: FC<TouchedDayScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  // Hooks
  const {
    appSettings: {
      appDefaults: {
        DEFAULT_COMMENT,
        DEFAULT_DAILY_WORK_HOURS,
        DEFAULT_HOURLY_RATE,
      },
    },
  } = useAppSelector(({ app }) => app);

  // Local State
  const [formData, setFormData] = useState<{
    hoursWorked: string;
    hourlyRate: string;
    startTime: string | null;
    endTime: string | null;
    comment: string;
  }>({
    hoursWorked: DEFAULT_DAILY_WORK_HOURS,
    hourlyRate: DEFAULT_HOURLY_RATE,
    startTime: null,
    endTime: null,
    comment: DEFAULT_COMMENT,
  });
  const [isDefaultData, setIsDefaultData] = useState<boolean>(false);
  const [isMoreDataExpanded, setIsMoreDataExpanded] = useState<boolean>(false);
  const [isStartEndExpanded, setIsStartEndExpanded] = useState<boolean>(false);

  const { databaseInstance: db, touchedDateInformation } = useAppSelector(
    ({ app }) => app
  );

  // Handlers
  const handleDeleteDayData = useCallback(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            DELETE FROM dayTracker
            WHERE dayId = ?
        `,
          [
            `${touchedDateInformation?.TOUCHED_DATE}-${monthNameLookup(
              touchedDateInformation?.TOUCHED_MONTH!
            )}-${touchedDateInformation?.TOUCHED_YEAR}`,
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
                `${monthNameLookup(touchedDateInformation?.TOUCHED_MONTH!)}-${
                  touchedDateInformation?.TOUCHED_YEAR
                }`,
              ],
              (_, { rows: { _array } }) => {
                dispatch(setDbMonthData(_array));
              }
            );
          },
          (err) => console.log(err),
          () => {
            navigation.goBack();
          }
        );
      }
    );
  }, [touchedDateInformation]);

  const handlePickStartEndTime = (type: "startTime" | "endTime") => {
    DateTimePickerAndroid.open({
      is24Hour: true,
      mode: "time",
      onChange: ({ type: opType }, date) => {
        if (opType === "set") {
          setFormData((formData) => ({
            ...formData,
            [type]: date?.toISOString()!,
          }));
        }
      },
      value: new Date(),
    });
  };

  const handleSaveData = useCallback(() => {
    const { comment, endTime, hourlyRate, hoursWorked, startTime } = formData;

    const dayId = `${touchedDateInformation?.TOUCHED_DATE}-${monthNameLookup(
      touchedDateInformation?.TOUCHED_MONTH!
    )}-${touchedDateInformation?.TOUCHED_YEAR}`;
    const weekId = `${getWeek(
      new Date(
        `${touchedDateInformation?.TOUCHED_YEAR}-${
          touchedDateInformation?.TOUCHED_MONTH! + 1
        }-${touchedDateInformation?.TOUCHED_DATE}`
      ),
      { weekStartsOn: 1 }
    )}-${touchedDateInformation?.TOUCHED_YEAR}`;
    const monthId = `${monthNameLookup(
      touchedDateInformation?.TOUCHED_MONTH!
    )}-${touchedDateInformation?.TOUCHED_YEAR}`;

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
            dayId,
            weekId,
            monthId,
            hoursWorked,
            hourlyRate,
            startTime || "",
            endTime || "",
            comment,
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
                `${monthNameLookup(touchedDateInformation?.TOUCHED_MONTH!)}-${
                  touchedDateInformation?.TOUCHED_YEAR
                }`,
              ],
              (_, { rows: { _array } }) => {
                dispatch(setDbMonthData(_array));
              }
            );
          },
          (err) => console.log(err),
          () => {
            navigation.goBack();
          }
        );
      }
    );
  }, [formData, touchedDateInformation]);

  // Effects
  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            SELECT * FROM dayTracker
            WHERE dayId = ?
        `,
          [
            `${touchedDateInformation?.TOUCHED_DATE}-${monthNameLookup(
              touchedDateInformation?.TOUCHED_MONTH!
            )}-${touchedDateInformation?.TOUCHED_YEAR}`,
          ],
          (_, { rows: { _array } }) => {
            if (!!_array[0]) {
              setFormData(() => _array[0]);
            } else {
              setIsDefaultData(() => true);

              setFormData((formData) => ({
                ...formData,
                hoursWorked: DEFAULT_DAILY_WORK_HOURS,
                hourlyRate: DEFAULT_HOURLY_RATE,
                comment: DEFAULT_COMMENT,
              }));
            }
          }
        );
      },
      (err) => console.log(err),
      () => {}
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeader
        title={`${weekDayNameLookup(
          new Date(
            `${touchedDateInformation?.TOUCHED_YEAR}-${
              touchedDateInformation?.TOUCHED_MONTH! + 1
            }-${touchedDateInformation?.TOUCHED_DATE}`
          ).getDay()
        )}, ${monthNameLookup(touchedDateInformation?.TOUCHED_MONTH!)} ${
          touchedDateInformation?.TOUCHED_DATE
        }, ${touchedDateInformation?.TOUCHED_YEAR}`}
      />
      <ScrollView>
        <View style={{ paddingHorizontal: DEFAULT_APP_PADDING }}>
          <View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleLarge">Start/End Time</Text>
              <IconButton
                icon={`chevron-${isStartEndExpanded ? "up" : "down"}`}
                mode="contained"
                onPress={() =>
                  setIsStartEndExpanded(
                    (isStartEndExpanded) => !isStartEndExpanded
                  )
                }
              />
            </View>
            {isStartEndExpanded && (
              <View>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <Pressable
                    onPress={() => {
                      handlePickStartEndTime("startTime");
                    }}
                    onLongPress={() => {
                      setFormData((formData) => ({
                        ...formData,
                        startTime: null,
                      }));
                    }}
                    style={{ flex: 1 }}
                  >
                    <TextInput
                      editable={false}
                      label="Start Time"
                      mode="outlined"
                      value={
                        formData.startTime
                          ? new Date(formData.startTime)
                              .toTimeString()
                              .split(" ")[0]
                              .trim()
                          : ""
                      }
                    />
                  </Pressable>
                  <IconButton
                    icon="clock"
                    iconColor="green"
                    mode="contained"
                    onPress={() => {
                      setFormData((formData) => ({
                        ...formData,
                        startTime: new Date().toISOString(),
                      }));
                    }}
                  />
                </View>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <Pressable
                    onPress={() => {
                      handlePickStartEndTime("endTime");
                    }}
                    onLongPress={() => {
                      setFormData((formData) => ({
                        ...formData,
                        endTime: null,
                      }));
                    }}
                    style={{ flex: 1 }}
                  >
                    <TextInput
                      editable={false}
                      label="End Time"
                      mode="outlined"
                      value={
                        formData.endTime
                          ? new Date(formData.endTime)
                              .toTimeString()
                              .split(" ")[0]
                              .trim()
                          : ""
                      }
                    />
                  </Pressable>
                  <IconButton
                    icon="clock"
                    iconColor="red"
                    mode="contained"
                    onPress={() => {
                      setFormData((formData) => ({
                        ...formData,
                        endTime: new Date().toISOString(),
                      }));
                    }}
                  />
                </View>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              contextMenuHidden
              keyboardType="numeric"
              label="Hours Worked"
              mode="outlined"
              onChangeText={(newHoursWorked) =>
                setFormData((formData) => ({
                  ...formData,
                  hoursWorked: newHoursWorked,
                }))
              }
              right={<TextInput.Affix text="hour(s)" />}
              style={{ flex: 1, marginRight: DEFAULT_APP_PADDING / 2 }}
              value={formData.hoursWorked}
            />
            <TextInput
              contextMenuHidden
              keyboardType="numeric"
              label="Hourly Rate"
              left={<TextInput.Affix text="$" />}
              mode="outlined"
              onChangeText={(newHourlyRate) =>
                setFormData((formData) => ({
                  ...formData,
                  hourlyRate: newHourlyRate,
                }))
              }
              style={{ flex: 1, marginLeft: DEFAULT_APP_PADDING / 2 }}
              value={formData.hourlyRate}
            />
          </View>
          <TextInput
            label="Comment"
            mode="outlined"
            multiline
            numberOfLines={4}
            onChangeText={(newComment) =>
              setFormData((formData) => ({ ...formData, comment: newComment }))
            }
            value={formData.comment}
          />
        </View>
        <ButtonWrapper>
          <IconButton
            disabled={isDefaultData}
            iconColor="red"
            icon="delete"
            mode="contained"
            onPress={() => {
              handleDeleteDayData();
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Button
              onPress={() => {
                navigation.goBack();
              }}
              style={{ paddingRight: DEFAULT_APP_PADDING }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                handleSaveData();
              }}
            >
              Save
            </Button>
          </View>
        </ButtonWrapper>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: DEFAULT_APP_PADDING,
          }}
        >
          <Text variant="titleLarge">More Information</Text>
          <IconButton
            icon={`chevron-${isMoreDataExpanded ? "up" : "down"}`}
            mode="contained"
            onPress={() => {
              setIsMoreDataExpanded(
                (isMoreDataExpanded) => !isMoreDataExpanded
              );
            }}
          />
        </View>
        {isMoreDataExpanded && <DataComponent />}
      </ScrollView>
    </SafeAreaView>
  );
};

export const DataComponent = () => {
  // Global State
  const {
    databaseInstance: db,
    dbMonthData,
    touchedDateInformation,
  } = useAppSelector(({ app }) => app);

  // Local State
  const [topExpandedSections, setTopExpandedSections] = useState<{
    earnings: boolean;
    hoursWorked: boolean;
  }>({ earnings: false, hoursWorked: false });
  const [weekData, setWeekData] = useState<TableData[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    const touchedWeek = getWeek(
      new Date(
        `${touchedDateInformation?.TOUCHED_YEAR}-${
          touchedDateInformation?.TOUCHED_MONTH! + 1
        }-${touchedDateInformation?.TOUCHED_DATE}`
      ),
      { weekStartsOn: 1 }
    );

    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            SELECT * FROM dayTracker
            WHERE weekId = ?
        `,
          [`${touchedWeek}-${touchedDateInformation?.TOUCHED_YEAR}`],
          (_, { rows: { _array } }) => {
            setWeekData(() => _array);
          }
        );
      },
      (err) => console.log(err),
      () => {
        setWeekDays(
          () =>
            getWeekData(
              new Date(
                `${touchedDateInformation?.TOUCHED_YEAR}-${
                  touchedDateInformation?.TOUCHED_MONTH! + 1
                }-${touchedDateInformation?.TOUCHED_DATE}`
              )
            ).daysOfTheWeek
        );
      }
    );
  }, [touchedDateInformation]);

  return (
    <View>
      <Pressable
        onPress={() =>
          setTopExpandedSections((expandedSections) => ({
            ...expandedSections,
            hoursWorked: !expandedSections.hoursWorked,
          }))
        }
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: DEFAULT_APP_PADDING,
          }}
        >
          <Text variant="titleMedium">Hours Worked</Text>
          <IconButton
            icon={`chevron-${topExpandedSections.hoursWorked ? "up" : "down"}`}
            size={10}
          />
        </View>
      </Pressable>
      {topExpandedSections.hoursWorked && <HoursWorkedSection />}
      {/* {topExpandedSections.hoursWorked && (
        <ScrollView
          horizontal
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row" }}
        >
          <View
            style={{
              width: WINDOW_WIDTH - DEFAULT_APP_PADDING * 4,
            }}
          >
            <Text>
              This week:{" "}
              {weekData.reduce((acc, val) => {
                return acc + parseFloat(val.hoursWorked);
              }, 0)}{" "}
              hour(s) worked
            </Text>
            {!!weekDays.length && <HoursWorkedSection />} */}
      {/* // <LineChart
              //   bezier
              //   chartConfig={{
              //     backgroundColor: "#e26a00",
              //     backgroundGradientFrom: "#fb8c00",
              //     backgroundGradientTo: "#ffa726",
              //     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              //     labelColor: (opacity = 1) =>
              //       `rgba(255, 255, 255, ${opacity})`,
              //     style: {
              //       borderRadius: 16,
              //     },
              //     propsForDots: {
              //       r: "6",
              //       strokeWidth: "2",
              //       stroke: "#ffa726",
              //     },
              //   }}
              //   data={{
                  // labels: weekDays.map((day) => `${day.split("-")[0]}`),
                  // datasets: [
                  //   {
                  //     data: weekDays.map((day) => {
                  //       const targetDay = weekData.find(
                  //         (rec) => rec.dayId === day
                  //       );

                  //       if (!!targetDay) {
                  //         return parseFloat(targetDay.hoursWorked);
                  //       } else {
                  //         return 0;
                  //       }
                  //     }), 
                  //   },
                  // ],
              //   }}
                // formatYLabel={(val) => parseInt(val).toString()}
                // fromZero
                // style={{
                //   borderRadius: 16,
                // }}
              //   //
              //   height={WINDOW_WIDTH - DEFAULT_APP_PADDING * 4}
              //   width={WINDOW_WIDTH - DEFAULT_APP_PADDING * 4}
              // /> */}
      {/* </View>
          <View>
            <Text>This Month - __ hour(s) worked</Text>
          </View>
        </ScrollView>
      )} */}
      <Pressable
        onPress={() =>
          setTopExpandedSections((expandedSections) => ({
            ...expandedSections,
            earnings: !expandedSections.earnings,
          }))
        }
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text variant="titleMedium">Earnings</Text>
          <IconButton
            icon={`chevron-${topExpandedSections.earnings ? "up" : "down"}`}
            size={10}
          />
        </View>
      </Pressable>
      {topExpandedSections.earnings && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!!weekDays.length && (
            <View>
              <Text>
                This week: $
                {weekData.reduce(
                  (acc, val) =>
                    acc +
                    parseFloat(val.hoursWorked) * parseFloat(val.hourlyRate),
                  0
                )}
              </Text>
              <LineChart
                bezier
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                data={{
                  labels: weekDays.map((day) => `${day.split("-")[0]}`),
                  datasets: [
                    {
                      data: weekDays.map((day) => {
                        const targetDay = weekData.find(
                          (rec) => rec.dayId === day
                        );

                        if (!!targetDay) {
                          return (
                            parseFloat(targetDay.hoursWorked) *
                            parseFloat(targetDay.hourlyRate)
                          );
                        } else {
                          return 0;
                        }
                      }),
                    },
                  ],
                }}
                fromZero
                style={{
                  borderRadius: 16,
                }}
                height={WINDOW_WIDTH - DEFAULT_APP_PADDING * 4}
                width={WINDOW_WIDTH - DEFAULT_APP_PADDING * 4}
                formatYLabel={(val) => `$${parseInt(val)}`}
              />
            </View>
          )}
          <Text>
            This month: $
            {dbMonthData.reduce((acc, val) => {
              return (
                acc + parseFloat(val.hourlyRate) * parseFloat(val.hoursWorked)
              );
            }, 0)}
          </Text>
        </ScrollView>
      )}
      {topExpandedSections.earnings && (
        <View>
          <Text>Charts for the earnings.</Text>
        </View>
      )}
    </View>
  );
};

export const ScreenHeader: FC<{ title?: string }> = ({ title }) => {
  const { goBack } = useNavigation();

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <IconButton
        icon="arrow-left"
        mode="contained"
        onPress={() => {
          goBack();
        }}
        style={{ marginRight: DEFAULT_APP_PADDING * 2 }}
      />
      <Text variant="titleLarge">{title || "Back"}</Text>
    </View>
  );
};
