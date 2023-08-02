import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";

import { AppRoot } from "@components";

export const App = () => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <AppRoot />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
