import { identity, pick, prop } from 'ramda';
import { createGame, Listener } from './game';
import { createImageService } from './image-service';

const imageService = createImageService('animals', {
  getImages: () =>
    Promise.resolve([
      { src: 'https://example.com/images/1.jpg' },
      { src: 'https://example.com/images/2.jpg' },
      { src: 'https://example.com/images/3.jpg' },
      { src: 'https://example.com/images/4.jpg' },
      { src: 'https://example.com/images/5.jpg' },
      { src: 'https://example.com/images/6.jpg' },
      { src: 'https://example.com/images/7.jpg' },
      { src: 'https://example.com/images/8.jpg' },
      { src: 'https://example.com/images/9.jpg' },
    ]),
  converter: identity,
});

test('initialises with a list of hidden cards', done => {
  createGame({
    imageService,
    numberOfPairs: 3,
    onInit: cards => {
      expect(cards.map(pick(['id', 'state']))).toEqual([
        { id: 'card-0', state: 'hidden' },
        { id: 'card-1', state: 'hidden' },
        { id: 'card-2', state: 'hidden' },
        { id: 'card-3', state: 'hidden' },
        { id: 'card-4', state: 'hidden' },
        { id: 'card-5', state: 'hidden' },
      ]);

      done();
    },
    onUpdate: () => {},
  });
});

test('serves the same image for each pair', done => {
  createGame({
    imageService,
    numberOfPairs: 3,
    onInit: cards => {
      expect(cards[0].getImage()).resolves.toEqual({
        src: 'https://example.com/images/1.jpg',
      });
      expect(cards[1].getImage()).resolves.toEqual({
        src: 'https://example.com/images/1.jpg',
      });
      expect(cards[2].getImage()).resolves.toEqual({
        src: 'https://example.com/images/2.jpg',
      });
      expect(cards[3].getImage()).resolves.toEqual({
        src: 'https://example.com/images/2.jpg',
      });
      expect(cards[4].getImage()).resolves.toEqual({
        src: 'https://example.com/images/3.jpg',
      });
      expect(cards[5].getImage()).resolves.toEqual({
        src: 'https://example.com/images/3.jpg',
      });

      done();
    },
    onUpdate: () => {},
  });
});

test('can reveal up to two cards', done => {
  const onUpdateListener: jest.MockedFunction<Listener> = jest.fn();

  createGame({
    imageService,
    numberOfPairs: 3,
    onInit: cards => {
      cards[0].reveal();
      cards[1].reveal();
      cards[2].reveal();
      cards[4].reveal();
      cards[3].reveal();
      cards[2].reveal();

      done();
    },
    onUpdate: onUpdateListener,
  });

  expect(onUpdateListener.mock.calls[0][0].map(prop('state'))).toEqual([
    'revealed',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[1][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[2][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'revealed',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[3][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'revealed',
    'hidden',
    'revealed',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[4][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'hidden',
    'revealed',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[5][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'paired',
    'paired',
    'hidden',
    'hidden',
  ]);
});

test('ignores subsequent calls to reveal', done => {
  const onUpdateListener: jest.MockedFunction<Listener> = jest.fn();

  createGame({
    imageService,
    numberOfPairs: 3,
    onInit: cards => {
      cards[0].reveal();
      cards[0].reveal();
      cards[1].reveal();
      cards[1].reveal();
      cards[2].reveal();
      cards[3].reveal();

      done();
    },
    onUpdate: onUpdateListener,
  });

  expect(onUpdateListener.mock.calls[0][0].map(prop('state'))).toEqual([
    'revealed',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[1][0].map(prop('state'))).toEqual([
    'revealed',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[2][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[3][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[4][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'revealed',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[5][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'paired',
    'paired',
    'hidden',
    'hidden',
  ]);
});

it('cannot reveal paired cards', done => {
  const onUpdateListener: jest.MockedFunction<Listener> = jest.fn();

  createGame({
    imageService,
    numberOfPairs: 3,
    onInit: cards => {
      cards[0].reveal();
      cards[1].reveal();
      cards[0].reveal();

      done();
    },
    onUpdate: onUpdateListener,
  });

  expect(onUpdateListener.mock.calls[0][0].map(prop('state'))).toEqual([
    'revealed',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[1][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);

  expect(onUpdateListener.mock.calls[2][0].map(prop('state'))).toEqual([
    'paired',
    'paired',
    'hidden',
    'hidden',
    'hidden',
    'hidden',
  ]);
});
