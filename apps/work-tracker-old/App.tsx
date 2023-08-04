import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components";
import { store } from "@store";

export const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <AppRoot />
        </View>
      </PaperProvider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
