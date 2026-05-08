import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import { RootScreen } from "./src/screens/RootScreen";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <RootScreen />
        </SafeAreaView>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6"
  }
});
