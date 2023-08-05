import type { FC } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector, useDateHooks } from "@hooks";
import type { MonthCarouselScreenProps } from "@types";
import { monthNameLookup } from "@utils";

export const MonthCarousel: FC<MonthCarouselScreenProps> = ({ navigation }) => {
  const {
    currentDateInformation: {
      CURRENT_DATE,
      CURRENT_WEEK_DAY,
      CURRENT_WEEK_DAY_LONG,
      CURRENT_MONTH,
      CURRENT_MONTH_LONG,
      CURRENT_YEAR,
    },
    selectedDateInformation: { SELECTED_MONTH, SELECTED_YEAR },
  } = useAppSelector(({ app }) => app);

  const { changeSelectedDate } = useDateHooks();

  return (
    <SafeAreaView>
      <Text>
        {CURRENT_WEEK_DAY_LONG}, {CURRENT_MONTH_LONG} {CURRENT_DATE},{" "}
        {CURRENT_YEAR}
      </Text>
      <Text>
        {monthNameLookup(SELECTED_MONTH)} {SELECTED_YEAR}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <Button
          mode="contained"
          onPress={() => {
            changeSelectedDate("prev");
          }}
        >
          Prev
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            changeSelectedDate("today");
          }}
        >
          Today
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            changeSelectedDate("next");
          }}
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};
