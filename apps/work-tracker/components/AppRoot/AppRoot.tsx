import { useCallback, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SplashScreen from "expo-splash-screen";

import { useAppDispatch, useAppSelector } from "@hooks";
import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { setAppDefaults, setIsInitialLoad } from "@store";
import { DrawerStackProps } from "@types";
import {
  createDefaultTableSQLString,
  dropDefaultTableSQLString,
  getAppDefaults,
} from "@utils";

const DrawerStack = createDrawerNavigator<DrawerStackProps>();

export const AppRoot = () => {
  const dispatch = useAppDispatch();

  const { databaseInstance: db } = useAppSelector(({ app }) => app);

  const handleInitialLoad = useCallback(() => {
    db.transaction(
      (tx) => {
        // tx.executeSql(dropDefaultTableSQLString);
        tx.executeSql(createDefaultTableSQLString);
      },
      (err) => console.log(err),
      async () => {
        const appDefaults = await getAppDefaults();

        if (!!appDefaults) {
          dispatch(setAppDefaults(appDefaults));
        }

        setIsInitialLoad(false);

        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 250);
      }
    );
  }, []);

  useEffect(() => {
    handleInitialLoad();
  }, []);

  return (
    <DrawerStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, swipeEdgeWidth: 1 }}
    >
      <DrawerStack.Screen component={HomeScreen} name="Home" />
      <DrawerStack.Screen component={SettingsScreen} name="Settings" />
    </DrawerStack.Navigator>
  );
};
