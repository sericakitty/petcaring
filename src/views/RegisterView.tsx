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
import { AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  FirestoreError,
} from "firebase/firestore";
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
  const [userName, setUserName] = useState<string>("");
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

  const validatePassword = (password: string, confirmPass: string) => {
    const specialChars = /[\^$*.\[\]{}()?"!@#%&\/\\,><':;|_~`]/;
    setPasswordValidations({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: new RegExp(specialChars).test(password),
      number: /[0-9]/.test(password),
      passwordsMatch: password === confirmPass,
    });
  };

  const resetInputFields = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setPasswordValidations({
      minLength: false,
      uppercase: false,
      lowercase: false,
      specialChar: false,
      number: false,
      passwordsMatch: false,
    });
  };

  // Reset input fields when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetInputFields();
      };
    }, []),
  );

  const handleRegister = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

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
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userName", "==", userName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Error", "Username already exists!");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        userName,
        email, // Save email to firestore so we can use it if user want to login with username
        pets: [],
        createdAt: new Date(),
      });

      Alert.alert("Success", "User registered successfully!");
      resetInputFields();
      navigation.navigate("Login");
    } catch (e) {
      const error = e as FirestoreError | AuthError;
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email already in use!");
        return;
      }
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={(text) => setUserName(text.trim())}
        value={userName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(text) => setEmail(text.trim().toLocaleLowerCase())}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={(text) => {
            text = text.trim();
            setPassword(text);
            validatePassword(text, confirmPassword);
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
            validatePassword(password, text);
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
