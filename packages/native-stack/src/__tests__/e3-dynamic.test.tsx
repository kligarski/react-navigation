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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="SettingsStack" component={MyStack} />
    </Tab.Navigator>
  );
}

// -----

import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';

// import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('always displays settings screen after settings tab bar button press', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const settingsTabButton = screen.getByRole('button', {
    name: 'SettingsStack, tab, 2 of 2',
  });

  await user.press(settingsTabButton);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Settings screen')).toBeVisible();

  await user.press(screen.getByText('Go to Details'));
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Details screen')).toBeVisible();

  await user.press(homeTabButton);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Home screen')).toBeVisible();

  await user.press(settingsTabButton);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Settings screen')).toBeVisible();
});
