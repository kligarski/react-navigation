import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

function SettingsScreen({ navigation }) {
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

function DetailsScreen({ navigation }) {
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

const SettingsStack = createStackNavigator();

function MyStack() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

// export
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarButtonTestID: 'homeTabBarButton' }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={MyStack}
        options={{ tabBarButtonTestID: 'settingsTabBarButton' }}
      />
    </Tab.Navigator>
  );
}

// -----

import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

// import { MyTabs } from './MyTabs';

test('always displays settings screen after settings tab bar button press', () => {
  jest.useFakeTimers();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

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
