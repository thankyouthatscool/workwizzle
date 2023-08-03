import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState, type FC } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setTouchedDateInformation } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { DbMonthData } from "@types";

import { ButtonWrapper, StartEndTimeWrapper } from "./Styled";
import { getDurationInHours, formatMilliseconds } from "@utils";

export const TouchedDateScreen = () => {
  const dispatch = useAppDispatch();

  const {
    appSettings: {
      appDefaults: {
        DEFAULT_COMMENT,
        DEFAULT_DAILY_HOURS,
        DEFAULT_HOURLY_RATE,
        DEFAULT_WEEKLY_HOURS,
      },
    },
    databaseInstance: db,
    touchedDateInformation,
  } = useAppSelector(({ app }) => app);

  const { goBack } = useNavigation();

  const [dayData, setDayData] = useState<DbMonthData | undefined>(undefined);
  const [formData, setFormData] = useState<{
    comment: string;
    hourlyRate: string[];
    hoursWorked: string[];
    startTime: string | null;
    endTime: string | null;
  }>({
    comment: DEFAULT_COMMENT,
    hourlyRate: [DEFAULT_HOURLY_RATE],
    hoursWorked: [DEFAULT_DAILY_HOURS],
    startTime: null,
    endTime: null,
  });
  const [isStartEndCollapsed, setIsStartEndCollapsed] = useState<boolean>(
    () => false
  );
  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(() => false);

  // Callbacks

  const handleSaveDayData = useCallback(() => {
    const { comment, hourlyRate, hoursWorked } = formData;

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
            `${touchedDateInformation?.TOUCHED_DATE}-${touchedDateInformation?.TOUCHED_MONTH}-${touchedDateInformation?.TOUCHED_YEAR}`,
            `${touchedDateInformation?.TOUCHED_MONTH}-${touchedDateInformation?.TOUCHED_YEAR}`,
            hoursWorked[0] || DEFAULT_DAILY_HOURS,
            hourlyRate[0] || DEFAULT_HOURLY_RATE,
            formData.startTime,
            formData.endTime,
            comment || DEFAULT_COMMENT,
          ],
          (_, { rows: { _array } }) => {
            console.log(_array);
          }
        );
      },
      (err) => {
        console.log(err);
      },
      () => {
        goBack();
      }
    );

    setIsUpdateNeeded(() => false);
  }, [formData, touchedDateInformation]);

  const handleSetNow = useCallback((type: "start" | "end") => {
    if (type === "start") {
      setFormData((formData) => ({
        ...formData,
        startTime: new Date().toISOString(),
      }));
    } else {
      setFormData((formData) => ({
        ...formData,
        endTime: new Date().toISOString(),
      }));
    }

    setIsUpdateNeeded(() => true);
  }, []);

  const handleTimePicker = useCallback((type: "start" | "end") => {
    DateTimePickerAndroid.open({
      is24Hour: true,
      mode: "time",
      onChange: (e, timeData) => {
        if (e.type !== "dismissed") {
          setIsUpdateNeeded(() => true);

          if (type === "start") {
            setFormData((formData) => ({
              ...formData,
              startTime: timeData?.toISOString() || null,
            }));
          } else {
            setFormData((formData) => ({
              ...formData,
              endTime: timeData?.toISOString() || null,
            }));
          }
        }
      },
      value: new Date(),
    });
  }, []);

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
            `${touchedDateInformation?.TOUCHED_DATE}-${touchedDateInformation?.TOUCHED_MONTH}-${touchedDateInformation?.TOUCHED_YEAR}`,
          ],
          (_, { rows: { _array } }) => {
            setDayData(() => _array[0]);
          }
        );
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    if (!!dayData) {
      setFormData(() => ({
        comment: dayData.comment,
        hourlyRate: [dayData.hourlyRate.toString()],
        hoursWorked: [dayData.hoursWorked.toString()],
        startTime: dayData.startTime || null,
        endTime: dayData.endTime || null,
      }));
    }
  }, [dayData]);

  // useEffect(() => {
  //   if (!!formData.startTime && !!formData.endTime) {
  //     console.log("Setting the hours worked automatically");

  //     const [startTime, endTime] = [formData.startTime, formData.endTime];

  //     setFormData((formData) => ({
  //       ...formData,
  //       hoursWorked: getDurationInHours(
  //         new Date(endTime).getTime() - new Date(startTime).getTime()
  //       ),
  //     }));
  //   }
  // }, [formData.startTime, formData.endTime]);

  return (
    <SafeAreaView>
      <ScreenHeader
        onBackCallback={() => {
          dispatch(setTouchedDateInformation(null));
        }}
      />
      <StartEndTimeWrapper>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text variant="titleLarge">Record Start/End Time</Text>
          <IconButton
            icon={`chevron-${isStartEndCollapsed ? "up" : "down"}`}
            mode="contained"
            onPress={() => {
              setIsStartEndCollapsed(
                (isStartEndCollapsed) => !isStartEndCollapsed
              );
            }}
          />
        </View>
        {isStartEndCollapsed && (
          <View>
            {!!formData.startTime && !!formData.endTime && (
              <View>
                <Text>
                  Hours Worked
                  {formatMilliseconds(
                    new Date(formData.endTime).getTime() -
                      new Date(formData.startTime).getTime()
                  )}
                </Text>
              </View>
            )}
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <TextInput
                label="Start Time"
                mode="outlined"
                style={{ flex: 1 }}
                value={
                  !!formData.startTime
                    ? new Date(formData.startTime)
                        .toLocaleString()
                        .split(",")[1]
                        .trim()
                    : ""
                }
              />
              <Button
                mode="contained"
                onPress={() => {
                  handleSetNow("start");
                }}
                style={{ marginLeft: DEFAULT_APP_PADDING, width: 100 }}
              >
                Start
              </Button>
              <IconButton
                icon="clock"
                mode="contained"
                onPress={() => {
                  handleTimePicker("start");
                }}
              />
            </View>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <TextInput
                label="End Time"
                mode="outlined"
                style={{ flex: 1 }}
                value={
                  !!formData.endTime
                    ? new Date(formData.endTime)
                        .toLocaleString()
                        .split(",")[1]
                        .trim()
                    : ""
                }
              />
              <Button
                mode="contained"
                onPress={() => {
                  handleSetNow("end");
                }}
                style={{ marginLeft: DEFAULT_APP_PADDING, width: 100 }}
              >
                End
              </Button>
              <IconButton
                icon="clock"
                mode="contained"
                onPress={() => {
                  handleTimePicker("end");
                }}
              />
            </View>
          </View>
        )}
      </StartEndTimeWrapper>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          label="Hours Worked"
          mode="outlined"
          onChangeText={(newHoursWorked) => {
            setIsUpdateNeeded(() => true);

            setFormData((formData) => ({
              ...formData,
              hoursWorked: [newHoursWorked],
            }));
          }}
          right={
            <TextInput.Affix
              text={
                parseFloat(formData.hoursWorked[0]) === 1 ? "hour" : "hours"
              }
            />
          }
          style={{
            flex: 1,
            marginLeft: DEFAULT_APP_PADDING,
            marginRight: DEFAULT_APP_PADDING / 2,
          }}
          value={formData.hoursWorked[0]}
        />
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          label="Hourly Rate"
          mode="outlined"
          onChangeText={(newHourlyRate) => {
            setIsUpdateNeeded(() => true);

            setFormData((formData) => ({
              ...formData,
              hourlyRate: [newHourlyRate],
            }));
          }}
          left={<TextInput.Affix text="$" />}
          style={{
            flex: 1,
            marginLeft: DEFAULT_APP_PADDING / 2,
            marginRight: DEFAULT_APP_PADDING,
          }}
          value={formData.hourlyRate[0].toString()}
        />
      </View>
      <TextInput
        label="Comment"
        mode="outlined"
        multiline
        numberOfLines={4}
        onChangeText={(newDayComment) => {
          setIsUpdateNeeded(() => true);

          setFormData((formData) => ({
            ...formData,
            comment: newDayComment,
          }));
        }}
        style={{ marginHorizontal: DEFAULT_APP_PADDING }}
        value={formData.comment}
      />
      <ButtonWrapper>
        <Button
          disabled={!isUpdateNeeded}
          mode="contained"
          onPress={handleSaveDayData}
        >
          Save
        </Button>
      </ButtonWrapper>
    </SafeAreaView>
  );
};

export const ScreenHeader: FC<{
  onBackCallback?: () => void;
  screenTitle?: string;
}> = ({ onBackCallback, screenTitle }) => {
  const { goBack } = useNavigation();

  return (
    <View style={{ alignItems: "center", flexDirection: "row" }}>
      <IconButton
        icon="arrow-left"
        mode="contained"
        onPress={() => {
          if (!!onBackCallback) {
            onBackCallback();
          }

          goBack();
        }}
      />
      <Text style={{ marginLeft: DEFAULT_APP_PADDING }} variant="headlineSmall">
        {screenTitle || "Back"}
      </Text>
    </View>
  );
};
