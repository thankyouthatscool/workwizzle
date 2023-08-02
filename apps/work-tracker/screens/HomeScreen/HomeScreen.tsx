import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MonthCarousel } from "@components/MonthCarousel";

import { FooterWrapper, HeaderWrapper, MonthCarouselWrapper } from "./Styled";

export const HomeScreen = () => {
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <HeaderWrapper>
        <Text>Home Screen Header</Text>
      </HeaderWrapper>
      <MonthCarouselWrapper>
        <MonthCarousel />
      </MonthCarouselWrapper>
      <FooterWrapper>
        <Text>Home Screen Footer</Text>
      </FooterWrapper>
    </SafeAreaView>
  );
};
