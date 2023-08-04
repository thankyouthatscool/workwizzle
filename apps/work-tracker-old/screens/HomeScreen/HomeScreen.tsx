import type { FC } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MonthCarousel } from "@components/MonthCarousel";
import { useDateInformation } from "@hooks";
import type { HomeScreenProps } from "@types";

import { FooterWrapper, HeaderWrapper, MonthCarouselWrapper } from "./Styled";

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const { handleSelectedDateChange } = useDateInformation();

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <HeaderWrapper>
        <Text>Home Screen Header</Text>
      </HeaderWrapper>
      <MonthCarouselWrapper>
        <MonthCarousel nav={navigation} />
      </MonthCarouselWrapper>
      <View style={{ flexDirection: "row" }}>
        <Button
          mode="contained"
          onPress={() => {
            handleSelectedDateChange("prev");
          }}
        >
          Prev
        </Button>
        <Button
          onPress={() => {
            handleSelectedDateChange("today");
          }}
        >
          Today
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            handleSelectedDateChange("next");
          }}
        >
          Next
        </Button>
      </View>
      <FooterWrapper>
        <Text>Home Screen Footer</Text>
      </FooterWrapper>
    </SafeAreaView>
  );
};
