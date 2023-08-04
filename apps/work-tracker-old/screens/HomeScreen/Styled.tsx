import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const FooterWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};

export const HeaderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>;
};

export const MonthCarouselWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};
