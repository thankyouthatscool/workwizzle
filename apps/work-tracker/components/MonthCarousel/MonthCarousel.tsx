import { useEffect, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Text } from "react-native-paper";

import { colors, DEFAULT_APP_PADDING } from "@theme";
import { getMonthInformation } from "@utils";

import { CalendarWrapper, MainWrapper, WeekdayHeaderWrapper } from "./Styled";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const MonthCarousel = () => {
  const [selectedMonthInformation, setSelectedMonthInformation] = useState<
    ReturnType<typeof getMonthInformation>
  >(() => getMonthInformation(2023, 8));

  useEffect(() => {
    console.log("Looking for the selected date....");
  }, []);

  return (
    <MainWrapper>
      <WeekdayHeaderWrapper>
        {["M", "T", "W", "T", "F", "S", "S"].map((letter, idx) => (
          <View
            key={idx}
            style={{
              alignItems: "center",
              borderRadius: 50,
              height: WINDOW_WIDTH / 7,
              justifyContent: "center",
              width: WINDOW_WIDTH / 7,
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: idx >= 5 ? colors.walledGreen : "white",
                borderColor: colors.walledGreen,
                borderWidth: 2,
                padding: DEFAULT_APP_PADDING / 2,
                borderRadius: 5,
                width: (WINDOW_WIDTH - DEFAULT_APP_PADDING ** 2) / 7,
              }}
            >
              <Text
                style={{
                  color: idx >= 5 ? "white" : colors.walledGreen,
                  fontWeight: "bold",
                }}
              >
                {letter}
              </Text>
            </View>
          </View>
        ))}
      </WeekdayHeaderWrapper>
      <CalendarWrapper>
        {Array.from({
          length:
            selectedMonthInformation.numberOfDays +
            selectedMonthInformation.firstDayIndex +
            6 -
            selectedMonthInformation.lastDayIndex,
        })
          .map((_, idx) => idx)
          .map((idx) => (
            <Pressable key={idx}>
              <Text>{idx}</Text>
            </Pressable>
          ))}
      </CalendarWrapper>
    </MainWrapper>
  );
};
