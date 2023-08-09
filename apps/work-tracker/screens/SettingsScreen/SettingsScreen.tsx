import { getWeek } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setAppDefaults, setDbMonthData } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { AppDefaults, TableData } from "@types";
import { saveAppDefaults } from "@utils";

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
          <Divider style={{ marginVertical: DEFAULT_APP_PADDING / 2 }} />
          <Text variant="titleLarge">Data Settings</Text>
          <DataSettingsSection />
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
    appSettings: { appDefaults },
  } = useAppSelector(({ app }) => app);

  // Local State
  const [formData, setFormData] = useState<AppDefaults>(() => ({
    DEFAULT_COMMENT: appDefaults.DEFAULT_COMMENT,
    DEFAULT_DAILY_WORK_HOURS: appDefaults.DEFAULT_DAILY_WORK_HOURS,
    DEFAULT_HOURLY_RATE: appDefaults.DEFAULT_HOURLY_RATE,
  }));
  const [isUpdateNeeded, setIsUpdateNeeded] = useState<boolean>(false);

  // Handlers
  const handleSaveAppDefaults = useCallback(async () => {
    await saveAppDefaults(formData);

    dispatch(setAppDefaults(formData));

    setIsUpdateNeeded(() => false);
  }, [formData]);

  // Effects
  useEffect(() => {
    if (!!appDefaults) {
      setFormData(() => appDefaults);
    }
  }, [appDefaults]);

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
        <Button>Reset</Button>
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

export const DataSettingsSection = () => {
  const dispatch = useAppDispatch();

  // Global State
  const { databaseInstance: db } = useAppSelector(({ app }) => app);

  // Local State
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState<boolean>(false);

  // Handlers
  const handelDeleteLocalData = useCallback(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(`
            DELETE FROM dayTracker
        `);
      },
      (err) => console.log(err),
      () => {
        dispatch(setDbMonthData([]));

        setIsConfirmDeleteModalOpen(() => false);
      }
    );
  }, []);

  const handleSeedData = useCallback(() => {
    const CURRENT_WEEK_NUMBER = getWeek(new Date(), { weekStartsOn: 1 });

    console.log(CURRENT_WEEK_NUMBER);

    const SEED_DATA: TableData[] = [
      {
        comment: "Test Data!",
        dayId: "1-August-2023",
        hourlyRate: "29",
        hoursWorked: "9",
        monthId: "August-2023",
        weekId: `${(CURRENT_WEEK_NUMBER - 1).toString()}-2023`,
      },
      {
        comment: "Test Data!",
        dayId: "2-August-2023",
        hourlyRate: "28",
        hoursWorked: "12",
        monthId: "August-2023",
        weekId: `${(CURRENT_WEEK_NUMBER - 1).toString()}-2023`,
      },
      {
        comment: "Test Data!",
        dayId: "7-August-2023",
        hourlyRate: "28",
        hoursWorked: "12",
        monthId: "August-2023",
        weekId: `${CURRENT_WEEK_NUMBER.toString()}-2023`,
      },
    ];

    console.log(SEED_DATA);

    db.transaction(
      (tx) => {
        SEED_DATA.map(
          ({
            comment,
            dayId,
            hourlyRate,
            hoursWorked,
            monthId,
            weekId,
            endTime,
            starTime,
          }) =>
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
                starTime || "",
                endTime || "",
                comment,
              ]
            )
        );
      },
      (err) => console.log(err),
      () => {}
    );

    console.log("seeding data");
  }, []);

  return (
    <View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text variant="bodyLarge">Clear Local Data</Text>
        <IconButton
          icon="delete"
          iconColor="red"
          mode="contained"
          onPress={() => {
            setIsConfirmDeleteModalOpen(() => true);
          }}
        />
      </View>
      {__DEV__ && (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Seed</Text>
          <IconButton
            iconColor="green"
            icon="seed"
            mode="contained"
            onPress={() => {
              handleSeedData();
            }}
          />
        </View>
      )}
      <Portal>
        <Modal
          onDismiss={() => {
            setIsConfirmDeleteModalOpen(() => false);
          }}
          visible={isConfirmDeleteModalOpen}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              marginHorizontal: DEFAULT_APP_PADDING,
              padding: DEFAULT_APP_PADDING ** 2,
            }}
          >
            <Text style={{ marginBottom: DEFAULT_APP_PADDING }}>
              Confirm deleting all local data?
            </Text>
            <Button
              buttonColor="red"
              icon="delete"
              onPress={() => {
                handelDeleteLocalData();
              }}
              textColor="white"
            >
              DELETE
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
