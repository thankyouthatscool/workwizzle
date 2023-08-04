import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { DrawerStackProps } from "@types";

const DrawerStack = createDrawerNavigator<DrawerStackProps>();

export const AppRoot = () => {
  return (
    <DrawerStack.Navigator screenOptions={{ headerShown: false }}>
      <DrawerStack.Screen component={HomeScreen} name="Home" />
      <DrawerStack.Screen component={SettingsScreen} name="Settings" />
    </DrawerStack.Navigator>
  );
};
