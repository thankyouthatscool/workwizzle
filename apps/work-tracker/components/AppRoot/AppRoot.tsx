import { useCallback, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { useAppSelector } from "@hooks";
import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { DrawerStackProps } from "@types";
import { createDefaultTableSQLString, dropDefaultTableSQLString } from "@utils";

const DrawerStack = createDrawerNavigator<DrawerStackProps>();

export const AppRoot = () => {
  const { databaseInstance: db } = useAppSelector(({ app }) => app);

  const handleInitialLoad = useCallback(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(createDefaultTableSQLString);
      },
      (err) => console.log(err)
    );
  }, []);

  useEffect(() => {
    handleInitialLoad();
  }, []);

  return (
    <DrawerStack.Navigator screenOptions={{ headerShown: false }}>
      <DrawerStack.Screen component={HomeScreen} name="Home" />
      <DrawerStack.Screen component={SettingsScreen} name="Settings" />
    </DrawerStack.Navigator>
  );
};
