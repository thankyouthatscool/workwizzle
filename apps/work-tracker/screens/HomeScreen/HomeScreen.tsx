import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MonthCarousel } from "@components/MonthCarousel";
import { TouchedDayScreen } from "@screens/TouchedDayScreen";
import type { HomeScreenStackProps } from "@types";

const HomeScreenStack = createNativeStackNavigator<HomeScreenStackProps>();

export const HomeScreen = () => {
  return (
    <HomeScreenStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeScreenStack.Screen component={MonthCarousel} name="MonthCarousel" />
      <HomeScreenStack.Screen
        component={TouchedDayScreen}
        name="TouchedDayScreen"
      />
    </HomeScreenStack.Navigator>
  );
};
