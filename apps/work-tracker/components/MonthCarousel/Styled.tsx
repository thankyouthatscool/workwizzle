import type { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const CalendarWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{children}</View>
  );
};

export const WeekdayWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ flexDirection: "row" }}>{children}</View>;
};
