import type { FC, PropsWithChildren } from "react";
import { View } from "react-native";

import { DEFAULT_APP_PADDING } from "@theme";

export const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: DEFAULT_APP_PADDING,
      }}
    >
      {children}
    </View>
  );
};
