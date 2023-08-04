import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Stack Props
export type DrawerStackProps = {
  Home: undefined;
  Settings: undefined;
};
export type HomeScreenStackProps = {
  MonthCarousel: undefined;
  TouchedDayScreen: undefined;
};

// Screen Nav Props
export type HomeScreenNavProps = DrawerScreenProps<DrawerStackProps, "Home">;
export type SettingsScreenNavProps = DrawerScreenProps<
  DrawerStackProps,
  "Settings"
>;
export type MonthCarouselScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeScreenStackProps, "MonthCarousel">,
  HomeScreenNavProps
>;
export type TouchedDayScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeScreenStackProps, "TouchedDayScreen">,
  HomeScreenNavProps
>;
