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

// export
const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
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

jest.useFakeTimers();

test('on every profile screen focus, displays loading state while waiting for data and then shows fetched profile', async () => {
  const user = userEvent.setup();

  const MyTabNavigation = createStaticNavigation(MyTabs);
  render(<MyTabNavigation />);

  const spy = jest.spyOn(window, 'fetch').mockImplementation(mockedFetch);

  const homeTabButton = screen.getByRole('button', {
    name: 'Home, tab, 1 of 2',
  });

  const profileTabButton = screen.getByRole('button', {
    name: 'Profile, tab, 2 of 2',
  });

  await user.press(profileTabButton);
  // act(() => jest.runAllTimers());

  expect(screen.getByText('Loading')).toBeVisible();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeVisible();

  await user.press(homeTabButton);
  await user.press(profileTabButton);
  // act(() => jest.runAllTimers());

  expect(screen.getByText('Loading')).toBeVisible();
  expect(spy).toHaveBeenCalled();
  expect(await screen.findByText('CookieDough')).toBeVisible();
});
