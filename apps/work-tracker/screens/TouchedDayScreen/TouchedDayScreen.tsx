import { useNavigation } from "@react-navigation/native";
import { type FC, useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector } from "@hooks";
import { DEFAULT_APP_PADDING } from "@theme";
import { TouchedDayScreenProps } from "@types";
import { monthNameLookup, weekDayNameLookup } from "@utils";

export const TouchedDayScreen: FC<TouchedDayScreenProps> = ({ navigation }) => {
  // State
  const [formData, setFormData] = useState({
    hoursWorked: "8",
    hourlyRate: "28",
    comment: "This is the default comment!",
  });

  const { databaseInstance: db, touchedDateInformation } = useAppSelector(
    ({ app }) => app
  );

  // Effects
  useEffect(() => {
    console.log("Getting all the things from the database...");

    db.transaction(
      (tx) => {
        tx.executeSql(
          `
            SELECT * FROM dayTracker
            WHERE dayId = ?
        `,
          [],
          (_, { rows: { _array } }) => {
            console.log(_array);
          }
        );
      },
      (err) => console.log(err),
      () => {
        console.log("Done");
      }
    );
  }, []);

  return (
    <SafeAreaView>
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
      <View style={{ paddingHorizontal: DEFAULT_APP_PADDING }}>
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
