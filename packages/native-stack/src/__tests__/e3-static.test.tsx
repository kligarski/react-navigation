import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}

function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.getParent().addListener('tabPress', (e) => {
      navigation.popToTop();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details screen</Text>
    </View>
  );
}

const SettingsNavigator = createStackNavigator({
  screens: {
    Settings: SettingsScreen,
    Details: DetailsScreen,
  },
});

// export
const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarButtonTestID: 'homeTabBarButton',
      },
    },
    SettingsStack: {
      screen: SettingsNavigator,
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

test('always displays settings screen after settings tab bar button press', () => {
  //   jest.useFakeTimers();

  const TabNavigation = createStaticNavigation(TabNavigator);
  render(<TabNavigation />);

  const homeTabButton = screen.getByTestId('homeTabBarButton');

  const settingsTabButton = screen.getByTestId('settingsTabBarButton');

  const event = {};

  fireEvent.press(settingsTabButton, event);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();

  fireEvent.press(screen.getByText('Go to Details'), event);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Details screen')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Home screen')).toBeOnTheScreen();

  fireEvent.press(settingsTabButton, event);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
