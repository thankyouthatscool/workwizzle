import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReduxProvider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";

SplashScreen.preventAutoHideAsync();

export const App = () => {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <PaperProvider>
            <View style={styles.container}>
              <StatusBar style="auto" />
              <AppRoot />
            </View>
          </PaperProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
