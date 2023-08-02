import { Dimensions, View } from "react-native";
import { Text } from "react-native-paper";

import { useDateInformation } from "@hooks";
import { colors, DEFAULT_APP_PADDING } from "@theme";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const MonthCarousel = () => {
  const {
    CURRENT_DATE,
    CURRENT_MONTH_LONG,
    CURRENT_WEEK_DAY_LONG,
    CURRENT_YEAR,
  } = useDateInformation();

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
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
                backgroundColor: idx >= 5 ? colors.walledGreen : "white",
                borderColor: colors.walledGreen,
                borderWidth: 2,
                padding: DEFAULT_APP_PADDING / 2,
                borderRadius: 5,
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
      </View>
    </View>
  );
};
