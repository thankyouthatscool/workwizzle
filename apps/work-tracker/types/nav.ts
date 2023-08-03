import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type HomeScreenStackProps = {
  HomeScreen: undefined;
  TouchedDateScreen: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  HomeScreenStackProps,
  "HomeScreen"
>;

export type MonthCarouselNavProps = NativeStackNavigationProp<
  HomeScreenStackProps,
  "HomeScreen",
  undefined
>;
