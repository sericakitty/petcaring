import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

import { TabNavigationProps } from "../types/navigation";

interface HomeViewProps {
  navigation: TabNavigationProps;
}

/**
 * Home view component
 * This component is the home view after user has logged in
 * 
 * @param navigation - navigation prop for routing
 * @returns Home view component
 */
const HomeView: React.FC<HomeViewProps> = ({ navigation }) => {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {auth.currentUser?.email}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default HomeView;

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
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#1976D2",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
