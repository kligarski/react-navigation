import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
    </View>
  );
};

// export
const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarButtonTestID: 'homeTabBarButton',
      },
    },
    Settings: {
      screen: SettingsScreen,
      options: {
        tabBarButtonTestID: 'settingsTabBarButton',
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});

// -----
import { expect, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

// import { TabNavigator } from './TabNavigator';

test('navigates to settings by tab bar button press', () => {
  const TabNavigation = createStaticNavigation(TabNavigator);
  render(<TabNavigation />);

  const button = screen.getByTestId('settingsTabBarButton');

  const event = {};
  fireEvent.press(button, event);

  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});