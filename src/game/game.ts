import { chain } from 'ramda';
import { ImageService } from './image-service';
import { Card } from './card';
import { createIdGenerator, Id } from './utils/id-generator';
import { shuffleArray } from './utils/shuffle-array';

const idGenerator = createIdGenerator('card-');

type GameConfig = {
  imageService: ImageService;
  numberOfPairs: number;
  onInit: Listener;
  onUpdate: Listener;
};

export type Listener = (cards: Card[]) => void;

export function createGame({
  imageService,
  numberOfPairs,
  onInit,
  onUpdate,
}: GameConfig): void {
  let pairCandidate: Id | undefined;

  let cards: Card[] = chain(() => {
    const cardAId = idGenerator.next().value;
    const cardBId = idGenerator.next().value;
    const getImage = () => imageService.getImage(`${cardAId}-${cardBId}`);

    return [
      {
        id: cardAId,
        getImage,
        pairId: cardBId,
        reveal: createReveal(cardAId),
        state: 'hidden',
      },
      {
        id: cardBId,
        getImage,
        pairId: cardAId,
        reveal: createReveal(cardBId),
        state: 'hidden',
      },
    ];
  }, Array.from({ length: numberOfPairs }));

  if (process.env.NODE_ENV !== 'test') {
    cards = shuffleArray(cards);
  }

  onInit(cards);

  function createReveal(cardId: Id) {
    return () => {
      const hiddenCard = cards.find(
        ({ id, state }) => id === cardId && state === 'hidden',
      );

      if (hiddenCard) {
        cards = revealCard(cards, hiddenCard.id);

        if (pairCandidate) {
          if (pairCandidate === hiddenCard.pairId) {
            cards = pairCards(cards, [hiddenCard.id, pairCandidate]);
          }

          pairCandidate = undefined;
        } else {
          cards = hideRevealedCards(cards);
          cards = revealCard(cards, hiddenCard.id);
          pairCandidate = hiddenCard.id;
        }
      }

      onUpdate(cards);
    };
  }
}

function revealCard(cards: Card[], cardId: Id): Card[] {
  return cards.map(card =>
    card.id === cardId && card.state === 'hidden'
      ? { ...card, state: 'revealed' }
      : card,
  );
}

function pairCards(cards: Card[], cardIds: Id[]): Card[] {
  return cards.map(card =>
    cardIds.some(cardId => card.id === cardId)
      ? { ...card, state: 'paired' }
      : card,
  );
}

function hideRevealedCards(cards: Card[]): Card[] {
  return cards.map(card =>
    card.state === 'revealed' ? { ...card, state: 'hidden' } : card,
  );
}
