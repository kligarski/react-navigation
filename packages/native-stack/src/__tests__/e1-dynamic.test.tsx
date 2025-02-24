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

const Tab = createBottomTabNavigator();

// export
const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButtonTestID: 'homeTabBarButton',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButtonTestID: 'settingsTabBarButton',
        }}
      />
    </Tab.Navigator>
  );
};

// -----
import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

// import { TabNavigator } from './TabNavigator';

test('navigates to settings by tab bar button press', () => {
  render(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

  const button = screen.getByTestId('settingsTabBarButton');

  const event = {};
  fireEvent.press(button, event);

  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});