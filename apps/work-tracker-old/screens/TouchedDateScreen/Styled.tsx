import type { FC, PropsWithChildren } from "react";
import { View } from "react-native";

import { DEFAULT_APP_PADDING } from "@theme";

export const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "center",
        margin: DEFAULT_APP_PADDING,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};

export const StartEndTimeWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        paddingHorizontal: DEFAULT_APP_PADDING,
      }}
    >
      {children}
    </View>
  );
};
