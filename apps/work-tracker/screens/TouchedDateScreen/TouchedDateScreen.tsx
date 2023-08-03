import { useNavigation } from "@react-navigation/native";
import { useState, type FC } from "react";
import { View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { setTouchedDateInformation } from "@store";
import { DEFAULT_APP_PADDING } from "@theme";
import { getMonthInformation } from "@utils";

export const TouchedDateScreen = () => {
  const dispatch = useAppDispatch();

  const { databaseInstance: db, touchedDateInformation } = useAppSelector(
    ({ app }) => app
  );

  const [touchedMonthInformation] = useState<
    ReturnType<typeof getMonthInformation>
  >(() =>
    getMonthInformation(
      touchedDateInformation?.TOUCHED_YEAR!,
      touchedDateInformation?.TOUCHED_MONTH!
    )
  );

  return (
    <SafeAreaView>
      <ScreenHeader
        onBackCallback={() => {
          dispatch(setTouchedDateInformation(null));
        }}
      />
      {!!touchedDateInformation && (
        <View>
          <Text>{touchedDateInformation.TOUCHED_DATE}</Text>
          <Text>{touchedDateInformation.TOUCHED_MONTH}</Text>
          <Text>{touchedDateInformation.TOUCHED_YEAR}</Text>
          <Text>{touchedMonthInformation.monthNameLong}</Text>
        </View>
      )}
      <TextInput
        label="Comment"
        mode="outlined"
        multiline
        numberOfLines={4}
        style={{ marginHorizontal: DEFAULT_APP_PADDING }}
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
