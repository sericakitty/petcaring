import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * Landing view component
 * This component is the landing view for the app
 * 
 * @returns Landing view component
 */
const LandingView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Petcare App</Text>
    </View>
  );
};

export default LandingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
