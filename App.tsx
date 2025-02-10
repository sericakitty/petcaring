import React, { useEffect } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import BottomTabs from "./src/navigation/BottomTabs";
import {
  NavigationProvider,
  useNavigationContext,
} from "./src/context/NavigationContext";

/**
 * NavigationContainerWrapper
 *
 * This component wraps the BottomTabs navigator with a NavigationContainer
 * and listens to navigation state changes to update the currentRoute in the
 * NavigationContext.
 */
const NavigationContainerWrapper = () => {
  const navigationRef = useNavigationContainerRef(); // Get navigationRef from hook
  const { setCurrentRoute, currentRoute } = useNavigationContext(); // Get currentRoute from context

  useEffect(() => {
    const listener = navigationRef.addListener("state", () => { // If navigation state changes, update currentRoute
      const routeName = navigationRef.getCurrentRoute()?.name || "Landing";
      if (routeName !== currentRoute) {
        setCurrentRoute(routeName);
      }
    });
    return listener; // Cleanup listener
  }, [navigationRef, currentRoute]);

  return (
    <NavigationContainer ref={navigationRef}>
      <BottomTabs />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <NavigationProvider>
      <NavigationContainerWrapper />
    </NavigationProvider>
  );
};

export default App;
