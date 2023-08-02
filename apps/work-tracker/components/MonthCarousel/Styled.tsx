import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const MainWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};

export const WeekdayHeaderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ flexDirection: "row" }}>{children}</View>;
};

export const CalendarWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};
