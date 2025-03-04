import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        onPress={() => navigation.navigate('Surprise')}
        title="Click here!"
      />
    </View>
  );
};

const SurpriseScreen = ({ navigation }) => {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    navigation.addListener('transitionEnd', () => setTextVisible(true));
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {textVisible ? <Text>Surprise!</Text> : ''}
    </View>
  );
};

// export
const MyStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Surprise" component={SurpriseScreen} />
    </Stack.Navigator>
  );
};

// -----

import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

// import { MyStack } from './MyStack';

jest.useFakeTimers();

test('surprise text appears after transition to surprise screen is complete', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );

  await user.press(screen.getByRole('button', { name: 'Click here!' }));

  expect(screen.queryByText('Surprise!')).not.toBeOnTheScreen();
  act(() => jest.runAllTimers());
  expect(screen.getByText('Surprise!')).toBeOnTheScreen();
});
