import { useNavigation } from "@react-navigation/native";
import { type FC, useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setTouchedDateInformation } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { DbMonthData } from "@types";

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

  const [formData, setFormData] = useState<{
    comment: string;
    hourlyRate: string;
    hoursWorked: string[];
  }>({
    comment: DEFAULT_COMMENT,
    hourlyRate: DEFAULT_HOURLY_RATE,
    hoursWorked: [DEFAULT_DAILY_HOURS],
  });

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM dayTracker",
          [],
          (_, { rows: { _array } }) => {
            console.log(_array);
          }
        );
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }, []);

  return (
    <SafeAreaView>
      <ScreenHeader
        onBackCallback={() => {
          dispatch(setTouchedDateInformation(null));
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          label="Hours Worked"
          mode="outlined"
          onChangeText={(newHoursWorked) => {
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
          left={<TextInput.Affix text="$" />}
          style={{
            flex: 1,
            marginLeft: DEFAULT_APP_PADDING / 2,
            marginRight: DEFAULT_APP_PADDING,
          }}
          value={formData.hourlyRate}
        />
      </View>
      <TextInput
        label="Comment"
        mode="outlined"
        multiline
        numberOfLines={4}
        onChangeText={(newDayComment) => {
          setFormData((formData) => ({ ...formData, comment: newDayComment }));
        }}
        style={{ marginHorizontal: DEFAULT_APP_PADDING }}
        value={formData.comment}
      />
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
