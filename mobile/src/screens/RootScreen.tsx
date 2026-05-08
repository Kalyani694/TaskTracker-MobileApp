import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthScreen } from "./AuthScreen";
import { TasksScreen } from "./TasksScreen";

export const RootScreen = () => {
  const { token, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return token ? <TasksScreen /> : <AuthScreen />;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
