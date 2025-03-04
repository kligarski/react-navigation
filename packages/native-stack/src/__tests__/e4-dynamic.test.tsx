import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
    </View>
  );
}

const url = 'https://pokeapi.co/api/v2/pokemon/ditto';

type PokemonData = {
  id: number;
  name: string;
};

type Result =
  | { status: 'loading' }
  | { status: 'success'; data: PokemonData }
  | { status: 'error' };

function ProfileScreen() {
  const [profileData, setProfileData] = useState<Result>({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      if (profileData.status !== 'success') {
        setProfileData({ status: 'loading' });

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchUser = async () => {
          try {
            const response = await fetch(url, { signal });
            const data = await response.json();

            setProfileData({ status: 'success', data: data });
          } catch (error) {
            setProfileData({ status: 'error' });
          }
        };

        fetchUser();

        return () => {
          controller.abort();
        };
      } else {
        return () => {};
      }
    }, [profileData.status])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {profileData.status === 'loading' ? (
        <Text>Loading...</Text>
      ) : profileData.status === 'error' ? (
        <Text>Error!</Text>
      ) : profileData.status === 'success' ? (
        <Text>{profileData.data.name}</Text>
      ) : null}
    </View>
  );
}

const Tab = createBottomTabNavigator();

// export
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// -----

import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

import { afterAll, afterEach, beforeAll } from '@jest/globals';

import { server } from '../../../../mocks/server';

beforeAll(() => {
  // Enable API mocking before all the tests.
  server.listen();
});

afterEach(() => {
  // Reset the request handlers between each test.
  // This way the handlers we add on a per-test basis
  // do not leak to other, irrelevant tests.
  server.resetHandlers();
});

afterAll(() => {
  // Finally, disable API mocking after the tests are done.
  server.close();
});

// import { MyTabs } from './MyTabs';

jest.useFakeTimers();

test('on profile screen focus, displays loading state while waiting for data and then shows fetched profile on every refocus', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const profileTabButton = screen.getByRole('button', {
    name: 'Profile, tab, 2 of 2',
  });

  await user.press(profileTabButton);
  expect(screen.getByText('Loading...')).toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();

  await user.press(homeTabButton);
  await user.press(profileTabButton);
  expect(screen.queryByText('Loading...')).not.toBeVisible();

  await act(() => jest.runAllTimers());

  expect(screen.getByText('ditto')).toBeVisible();
});
