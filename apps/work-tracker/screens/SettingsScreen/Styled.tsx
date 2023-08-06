import type { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const MainWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

export const FooterWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};
