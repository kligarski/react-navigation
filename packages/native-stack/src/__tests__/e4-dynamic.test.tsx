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

const url = 'placeholder_url';

function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const data = await (await fetch(url)).json();

          if (isActive) {
            setData(data);
            setLoading(false);
          }
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchUser();

      return () => {
        setData(undefined);
        setError(undefined);
        setLoading(true);
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Text>Loading</Text>}
      {!loading && error && <Text>{error.message}</Text>}
      {!loading && !error && <Text>{data.profile.nick}</Text>}
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
import { fireEvent, render, screen } from '@testing-library/react-native';

// import { MyTabs } from './MyTabs';

async function mockedFetch() {
  const mockResponse = {
    profile: {
      nick: 'CookieDough',
    },
  };
  return {
    ok: true,
    status: 200,
    json: async () => {
      return mockResponse;
    },
  };
}

test('on every profile screen focus, displays loading state while waiting for data and then shows fetched profile', async () => {
  // jest.useFakeTimers();

  render(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const profileTabButton = screen.getByRole('button', {
    name: 'Profile, tab, 2 of 2',
  });

  const event = {};
  fireEvent.press(profileTabButton, event);
  // act(() => jest.runAllTimers());

  expect(screen.getByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();

  fireEvent.press(homeTabButton, event);
  fireEvent.press(profileTabButton, event);
  // act(() => jest.runAllTimers());

  expect(screen.getByText('Loading')).toBeOnTheScreen();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeOnTheScreen();
});
