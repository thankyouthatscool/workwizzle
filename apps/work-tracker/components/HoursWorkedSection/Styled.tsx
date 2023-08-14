import type { FC, PropsWithChildren } from "react";
import { Dimensions, View } from "react-native";

import { DEFAULT_APP_PADDING } from "@theme";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const WeekSection: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ width: WINDOW_WIDTH }}>{children}</View>;
};

export const MonthSection: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ width: WINDOW_WIDTH }}>{children}</View>;
};

export const PhysicalYearSection: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ width: WINDOW_WIDTH }}>{children}</View>;
};

export const FinancialYearSection: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ width: WINDOW_WIDTH }}>{children}</View>;
};
