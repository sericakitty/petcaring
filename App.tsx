import React, { useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import BottomTabs from "./src/navigation/BottomTabs";
import { NavigationProvider, useNavigationContext } from "./src/context/NavigationContext";

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
    const listener = navigationRef.addListener("state", () => {
      const routeName = navigationRef.getCurrentRoute()?.name || "Landing";
      if (routeName !== currentRoute) { // Update currentRoute if it has changed
        setCurrentRoute(routeName);
      }
    });
    return () => navigationRef.removeListener("state", listener); // Remove listener on unmount
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
