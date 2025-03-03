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
const MyTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// -----
import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

// import { MyTabs } from './MyTabs';

test('navigates to settings by tab bar button press', () => {
  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const button = screen.getByRole('button', { name: 'Settings, tab, 2 of 2' });

  const event = {};
  fireEvent.press(button, event);

  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
