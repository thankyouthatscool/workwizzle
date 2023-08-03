import { useNavigation } from "@react-navigation/native";
import { type FC, useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setTouchedDateInformation } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { DbMonthData } from "@types";

import { ButtonWrapper, StartEndTimeWrapper } from "./Styled";

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
  }>({
    comment: DEFAULT_COMMENT,
    hourlyRate: [DEFAULT_HOURLY_RATE],
    hoursWorked: [DEFAULT_DAILY_HOURS],
  });
  const [isStartEndCollapsed, setIsStartEndCollapsed] = useState<boolean>(
    () => false
  );
  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(() => false);

  const handleSaveDayData = useCallback(() => {
    const { comment, hourlyRate, hoursWorked } = formData;

    const { TOUCHED_DATE, TOUCHED_MONTH, TOUCHED_YEAR } =
      touchedDateInformation!;

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
            `${TOUCHED_DATE}-${TOUCHED_MONTH}-${TOUCHED_YEAR}`,
            `${TOUCHED_MONTH}-${TOUCHED_YEAR}`,
            hoursWorked[0],
            hourlyRate[0],
            null,
            null,
            comment,
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

  useEffect(() => {
    const { TOUCHED_DATE, TOUCHED_MONTH, TOUCHED_YEAR } =
      touchedDateInformation!;

    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            SELECT * FROM dayTracker
            WHERE dayId = ?
          `,
          [`${TOUCHED_DATE}-${TOUCHED_MONTH}-${TOUCHED_YEAR}`],
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
      }));
    }
  }, [dayData]);

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
            <Text>Something else go here...</Text>
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
