import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

export type TabNavigationProps = BottomTabNavigationProp<RootStackParamList>;

