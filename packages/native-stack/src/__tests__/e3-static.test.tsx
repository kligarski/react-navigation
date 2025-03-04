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

const MyStack = createStackNavigator({
  screens: {
    Settings: SettingsScreen,
    Details: DetailsScreen,
  },
});

// export
const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    SettingsStack: MyStack,
  },
  screenOptions: {
    headerShown: false,
  },
});

// -----
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';

// import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('always displays settings screen after settings tab bar button press', async () => {
  const user = userEvent.setup();

  const MyTabNavigation = createStaticNavigation(MyTabs);
  render(<MyTabNavigation />);

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const settingsTabButton = screen.getByRole('button', {
    name: 'SettingsStack, tab, 2 of 2',
  });

  await user.press(settingsTabButton);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();

  await user.press(screen.getByText('Go to Details'));
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Details screen')).toBeOnTheScreen();

  await user.press(homeTabButton);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Home screen')).toBeOnTheScreen();

  await user.press(settingsTabButton);
  //   act(() => jest.runAllTimers());
  expect(screen.getByText('Settings screen')).toBeOnTheScreen();
});
