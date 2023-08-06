import { useNavigation } from "@react-navigation/native";
import { type FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setDbMonthData } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { TouchedDayScreenProps } from "@types";
import { monthNameLookup, weekDayNameLookup } from "@utils";

import { ButtonWrapper } from "./Styled";

export const TouchedDayScreen: FC<TouchedDayScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  // State
  const [formData, setFormData] = useState({
    hoursWorked: "8",
    hourlyRate: "28",
    comment: "This is the default comment!",
  });
  const [isDefaultData, setIsDefaultData] = useState<boolean>(false);

  const { databaseInstance: db, touchedDateInformation } = useAppSelector(
    ({ app }) => app
  );

  // Handlers
  const handleSaveData = useCallback(() => {
    const { comment, hourlyRate, hoursWorked } = formData;

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
          [dayId, monthId, hoursWorked, hourlyRate, "", "", comment]
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

              setFormData(() => ({
                hoursWorked: "8",
                hourlyRate: "28",
                comment: "This is the default comment!",
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
      <ButtonWrapper>
        <IconButton
          disabled={isDefaultData}
          iconColor="red"
          icon="delete"
          mode="contained"
          onPress={() => {
            navigation.goBack();
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
