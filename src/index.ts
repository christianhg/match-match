import { Card } from './game/card';
import { createGame } from './game/game';
import { createImageService } from './game/image-service';
import { getPixabayImages } from './pixabay';

const cardContainer = document.querySelector('#cards')!;

createGame({
  imageService: createImageService('match', {
    getImages: getPixabayImages,
    converter: ({ webformatURL }) => ({ src: webformatURL }),
  }),
  numberOfPairs: 14,
  onInit: cards => {
    cards.forEach(card => {
      cardContainer.appendChild(createCardElement(card));
    });
  },
  onUpdate: cards => {
    cards.forEach(card => {
      const existingCard = cardContainer.querySelector<HTMLElement>(
        `#${card.id}`,
      )!;

      existingCard.dataset.state = card.state;
    });
  },
});

function createCardElement(card: Card): HTMLElement {
  const cardElement = document.createElement('li');
  const front = document.createElement('span');
  const back = document.createElement('span');
  const img = document.createElement('img');

  cardElement.setAttribute('class', 'card');
  cardElement.id = card.id;
  cardElement.dataset.state = card.state;
  front.setAttribute('class', 'front');
  back.setAttribute('class', 'back');

  back.addEventListener(
    'mouseenter',
    () => {
      card.getImage().then(image => {
        img.src = image.src;
      });
    },
    { once: true },
  );
  back.addEventListener('click', card.reveal);

  front.appendChild(img);
  cardElement.appendChild(front);
  cardElement.appendChild(back);

  return cardElement;
}
