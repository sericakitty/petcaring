import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../types/navigation";

// Lazy load views
const LandingView = React.lazy(() => import("../views/LandingView"));
const RegisterView = React.lazy(() => import("../views/RegisterView"));
const LoginView = React.lazy(() => import("../views/LoginView"));
const HomeView = React.lazy(() => import("../views/HomeView"));

const Tab = createBottomTabNavigator<RootStackParamList>();

/**
 * CustomTabBar component
 * This component is a custom tab bar for the app
 * 
 * @param state - state prop for the tab bar
 * @param descriptors - descriptors prop for the tab bar
 * @param navigation - navigation prop for the tab bar
 * @returns CustomTabBar component
 */
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  // Get current active route name
  const currentRoute = state.routes[state.index].name;
  // Determine which routes should be visible
  let visibleRouteNames: string[] = [];
  if (currentRoute === "Landing") {
    visibleRouteNames = ["Login", "Register"];
  } else if (currentRoute === "Login") {
    visibleRouteNames = ["Landing", "Register"];
  } else if (currentRoute === "Register") {
    visibleRouteNames = ["Landing", "Login"];
  } else {
    // For any other route (e.g. Home), do not show the tab bar.
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        if (!visibleRouteNames.includes(route.name)) {
          return null;
        }
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Set the icon name based on route name
        let iconName = "";
        switch (route.name) {
          case "Landing":
            iconName = "home-outline";
            break;
          case "Login":
            iconName = "log-in-outline";
            break;
          case "Register":
            iconName = "person-add-outline";
            break;
          default:
            iconName = "home-outline";
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? "tomato" : "gray"}
            />
            <Text style={{ color: isFocused ? "tomato" : "gray" }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/**
 * BottomTabs component
 * This component is the bottom tab navigation for the app
 * 
 * @returns BottomTabs component
 */
const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Landing" // Set the initial route
      screenOptions={{
        // Hide the default above tab bar
        headerShown: false,
      }}
      // Use custom tab bar instead of the default one.
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Landing" component={LandingView} />
      <Tab.Screen name="Register" component={RegisterView} />
      <Tab.Screen name="Login" component={LoginView} />
      <Tab.Screen name="Home" component={HomeView} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
