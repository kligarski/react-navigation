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
const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

// -----
import { expect, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { fireEvent, render, screen } from '@testing-library/react-native';

// import { MyTabs } from './MyTabs';

test('navigates to settings by tab bar button press', () => {
  const MyTabNavigation = createStaticNavigation(MyTabs);
  render(<MyTabNavigation />);

  const button = screen.getByRole('button', { name: 'Settings, tab, 2 of 2' });

  const event = {};
  fireEvent.press(button, event);

  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
