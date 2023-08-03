import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "@screens/HomeScreen";
import { TouchedDateScreen } from "@screens/TouchedDateScreen";
import type { HomeScreenStackProps } from "@types";

const HomeScreenStack = createNativeStackNavigator<HomeScreenStackProps>();

export const AppRoot = () => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "white",
        },
      }}
    >
      <HomeScreenStack.Navigator
        screenOptions={{ animation: "fade_from_bottom", headerShown: false }}
      >
        <HomeScreenStack.Screen component={HomeScreen} name="HomeScreen" />
        <HomeScreenStack.Screen
          component={TouchedDateScreen}
          name="TouchedDateScreen"
        />
      </HomeScreenStack.Navigator>
    </NavigationContainer>
  );
};
