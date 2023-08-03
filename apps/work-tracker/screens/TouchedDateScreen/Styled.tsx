import type { FC, PropsWithChildren } from "react";
import { View } from "react-native";

import { DEFAULT_APP_PADDING } from "@theme";

export const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        margin: DEFAULT_APP_PADDING,
        flexDirection: "row",
        justifyContent: "flex-end",
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
