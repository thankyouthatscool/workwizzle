import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppDefaults } from "@types";

export const saveAppDefaults = async (appDefaults: AppDefaults) => {
  await AsyncStorage.setItem("appDefaults", JSON.stringify(appDefaults));
};

export const getAppDefaults = async () => {
  const resString = await AsyncStorage.getItem("appDefaults");

  if (!!resString) {
    return JSON.parse(resString) as AppDefaults;
  }
};
