import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon/ditto', async () => {
    await delay(1000);

    return HttpResponse.json({
      id: 132,
      name: 'ditto',
    });
  }),
];
