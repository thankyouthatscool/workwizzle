import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setAppDefaults } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { AppDefaults } from "@types";

import { FooterWrapper, MainWrapper } from "./Styled";

export const SettingsScreen = () => {
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <MainWrapper>
        <ScrollView
          style={{
            paddingHorizontal: DEFAULT_APP_PADDING,
          }}
        >
          <Text variant="titleLarge">App Defaults</Text>
          <Divider style={{ marginVertical: DEFAULT_APP_PADDING / 2 }} />
          <AppDefaultsSettingsSection />
        </ScrollView>
      </MainWrapper>
      <FooterWrapper />
    </SafeAreaView>
  );
};

export const AppDefaultsSettingsSection = () => {
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
  const [formData, setFormData] = useState<AppDefaults>(() => ({
    DEFAULT_COMMENT,
    DEFAULT_DAILY_WORK_HOURS,
    DEFAULT_HOURLY_RATE,
  }));
  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(false);

  // Handlers
  const handleSaveAppDefaults = useCallback(() => {
    dispatch(setAppDefaults(formData));

    setIsUpdateNeeded(() => false);
  }, [formData]);

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          label="Hours Worked"
          mode="outlined"
          onChangeText={(newDailyHoursWorked) => {
            setIsUpdateNeeded(() => true);

            setFormData((formData) => ({
              ...formData,
              DEFAULT_DAILY_WORK_HOURS: newDailyHoursWorked,
            }));
          }}
          right={<TextInput.Affix text="hour(s)" />}
          style={{ flex: 1, marginRight: DEFAULT_APP_PADDING / 2 }}
          value={formData.DEFAULT_DAILY_WORK_HOURS}
        />
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          label="Hourly Rate"
          left={<TextInput.Affix text="$" />}
          mode="outlined"
          onChangeText={(newHourlyRate) => {
            setIsUpdateNeeded(() => true);

            setFormData((formData) => ({
              ...formData,
              DEFAULT_HOURLY_RATE: newHourlyRate,
            }));
          }}
          style={{ flex: 1, marginLeft: DEFAULT_APP_PADDING / 2 }}
          value={formData.DEFAULT_HOURLY_RATE}
        />
      </View>
      <TextInput
        label="Comment"
        mode="outlined"
        multiline
        numberOfLines={4}
        onChangeText={(newDefaultComment) => {
          setIsUpdateNeeded(() => true);

          setFormData((formData) => ({
            ...formData,
            DEFAULT_COMMENT: newDefaultComment,
          }));
        }}
        value={formData.DEFAULT_COMMENT}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginVertical: DEFAULT_APP_PADDING / 2,
        }}
      >
        <Button
          disabled={!isUpdateNeeded}
          mode="contained"
          onPress={handleSaveAppDefaults}
        >
          Save
        </Button>
      </View>
    </View>
  );
};
