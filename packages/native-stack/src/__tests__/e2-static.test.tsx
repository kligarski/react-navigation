import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

const HomeScreen = () => {
  const navigation = useNavigation();

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

const SurpriseScreen = () => {
  const navigation = useNavigation();

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
const MyStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Surprise: SurpriseScreen,
  },
});

// -----
import { expect, jest, test } from '@jest/globals';
import { createStaticNavigation } from '@react-navigation/native';
import { act, render, screen, userEvent } from '@testing-library/react-native';

// import { MyStack } from './MyStack';

jest.useFakeTimers();

test('surprise text appears after transition to surprise screen is complete', async () => {
  const user = userEvent.setup();

  const MyStackNavigation = createStaticNavigation(MyStack);
  render(<MyStackNavigation />);

  await user.press(screen.getByRole('button', { name: 'Click here!' }));

  expect(screen.queryByText('Surprise!')).not.toBeOnTheScreen();
  act(() => jest.runAllTimers());
  expect(screen.getByText('Surprise!')).toBeOnTheScreen();
});
