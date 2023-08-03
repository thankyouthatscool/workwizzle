import { useCallback, useEffect } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAppSelector } from "@hooks";
import { HomeScreen } from "@screens/HomeScreen";
import { TouchedDateScreen } from "@screens/TouchedDateScreen";
import type { HomeScreenStackProps } from "@types";
import { createDefaultTableSQLString } from "@utils";

const HomeScreenStack = createNativeStackNavigator<HomeScreenStackProps>();

export const AppRoot = () => {
  const { databaseInstance: db } = useAppSelector(({ app }) => app);

  const handleInitialLoad = useCallback(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(createDefaultTableSQLString, []);
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log("Database OK");
      }
    );
  }, []);

  useEffect(() => {
    handleInitialLoad();
  }, []);

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
