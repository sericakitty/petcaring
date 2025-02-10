import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  FirestoreError,
} from "firebase/firestore";
import { TabNavigationProps } from "../types/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

type LoginViewProps = {
  navigation: TabNavigationProps;
};

/**
 * Login view component
 * This component allows users to login with email or username and password
 *
 * @param navigation - navigation prop for routing
 * @returns Login view component
 */
const LoginView: React.FC<LoginViewProps> = ({ navigation }) => {
  const [credential, setCredential] = useState<string>();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isUsername, setIsUsername] = useState<boolean>(false);

  const handleUserNameOrEmailInput = (text: string) => {
    if (text.includes("@")) {
      setIsUsername(false);
    } else {
      setIsUsername(true);
    }
    setCredential(text);
  };

  const resetInputFields = () => {
    setCredential("");
    setPassword("");
    setShowPassword(false);
    setIsUsername(false);
  };

  // Reset input fields when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetInputFields();
      };
    }, []),
  );

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!credential || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
    let emailToUse = credential;

    // Check if username is used instead of email
    if (isUsername) {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userName", "==", credential));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Error", "Invalid username!");
          return;
        }
        // Get email from username and set it to emailToUse, which will be used for login
        emailToUse = querySnapshot.docs.map((doc) => doc.data())[0].email;

        if (!emailToUse) {
          Alert.alert("Error", "No email found for this username!");
          return;
        }
      } catch (error: any) {
        Alert.alert("Error", "Failed to retrieve user: " + error.message);
        return;
      }
    }
    console.log("emailtouse", emailToUse);
    try {
      await signInWithEmailAndPassword(auth, emailToUse, password);
      Alert.alert("Success", "Login successful!");
      resetInputFields();
      navigation.navigate("Home");
    } catch (error: any) {
      error = error as AuthError;
      console.log("error", error);
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "Invalid credentials!");
        return;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email or Username"
        style={styles.input}
        onChangeText={handleUserNameOrEmailInput}
        value={credential}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={setPassword}
          value={password}
        />
        <Pressable
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="grey"
          />
        </Pressable>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    height: 40,
    marginBottom: 10,
    position: "relative",
  },
  passwordInput: {
    width: "90%",
    height: "100%",
    paddingLeft: 8,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
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
