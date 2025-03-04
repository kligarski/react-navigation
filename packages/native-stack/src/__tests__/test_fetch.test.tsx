import { afterAll, afterEach, beforeAll, expect, test } from '@jest/globals';

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

test('receives a mocked response to a REST API request', async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');

  expect(response.status).toBe(200);
  expect(response.statusText).toBe('OK');
  expect(await response.json()).toEqual({
    id: 132,
    name: 'ditto',
  });
});
