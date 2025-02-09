import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TabNavigationProps } from "../types/navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

type RegisterViewProps = {
  navigation: TabNavigationProps;
};

/**
 * Register view component
 * This component allows users to register an account with email and password
 *
 * @param navigation - navigation prop for routing
 * @returns Register view component
 */
const RegisterView: React.FC<RegisterViewProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
    passwordsMatch: false,
  });

  const validatePassword = (password: string) => {
    const specialChars = /[\^$*.\[\]{}()?"!@#%&\/\\,><':;|_~`]/;
    setPasswordValidations({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: new RegExp(specialChars).test(password),
      number: /[0-9]/.test(password),
      passwordsMatch: password === confirmPassword,
    });
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    const allValid = Object.values(passwordValidations).every((v) => v);
    if (!allValid) {
      Alert.alert("Error", "Please ensure all password requirements are met.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "User registered successfully!");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
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
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={(text) => {
            setConfirmPassword(text);
            validatePassword(password);
          }}
          value={confirmPassword}
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
      <View style={styles.validationContainer}>
        <Text
          style={passwordValidations.minLength ? styles.valid : styles.invalid}
        >
          • Minimum 8 characters
        </Text>
        <Text
          style={passwordValidations.uppercase ? styles.valid : styles.invalid}
        >
          • At least one uppercase letter
        </Text>
        <Text
          style={passwordValidations.lowercase ? styles.valid : styles.invalid}
        >
          • At least one lowercase letter
        </Text>
        <Text
          style={
            passwordValidations.specialChar ? styles.valid : styles.invalid
          }
        >
          • At least one special character
        </Text>
        <Text
          style={passwordValidations.number ? styles.valid : styles.invalid}
        >
          • At least one number
        </Text>
        <Text
          style={
            passwordValidations.passwordsMatch ? styles.valid : styles.invalid
          }
        >
          • Passwords match
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
};

export default RegisterView;

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
  validationContainer: {
    marginBottom: 20,
  },
  invalid: {
    color: "red",
    fontSize: 12,
  },
  valid: {
    color: "green",
    fontSize: 12,
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
