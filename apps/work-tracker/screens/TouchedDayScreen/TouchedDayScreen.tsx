import { useNavigation } from "@react-navigation/native";
import { type FC, useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setDbMonthData } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { TouchedDayScreenProps } from "@types";
import { monthNameLookup, weekDayNameLookup } from "@utils";

import { ButtonWrapper } from "./Styled";

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
  const [isStartEndExpanded, setIsStartEndExpanded] = useState<boolean>(false);

  const { databaseInstance: db, touchedDateInformation } = useAppSelector(
    ({ app }) => app
  );

  // Handlers
  const handleDeleteDayData = useCallback(() => {
    console.log(touchedDateInformation?.TOUCHED_DATE);
    console.log(monthNameLookup(touchedDateInformation?.TOUCHED_MONTH!));
    console.log(touchedDateInformation?.TOUCHED_YEAR);

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
    const monthId = `${monthNameLookup(
      touchedDateInformation?.TOUCHED_MONTH!
    )}-${touchedDateInformation?.TOUCHED_YEAR}`;

    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            INSERT INTO dayTracker
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (dayId) DO UPDATE SET
              monthId = excluded.monthId,
              hoursWorked = excluded.hoursWorked,
              hourlyRate = excluded.hourlyRate,
              startTime = excluded.startTime,
              endTime = excluded.endTime,
              comment = excluded.comment
        `,
          [
            dayId,
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
              console.log(_array[0]);

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
          <IconButton icon="chevron-down" mode="contained" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const ScreenHeader: FC<{ title?: string }> = ({ title }) => {
  const { goBack } = useNavigation();

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        padding: DEFAULT_APP_PADDING,
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
