import { FC, PropsWithChildren } from "react";
import { Dimensions, View } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const MainWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {children}
    </View>
  );
};

export const WeekdayHeaderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ flexDirection: "row" }}>{children}</View>;
};

export const CalendarWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        borderColor: "red",
        flexDirection: "row",
        flexWrap: "wrap",
        width: WINDOW_WIDTH,
      }}
    >
      {children}
    </View>
  );
};
