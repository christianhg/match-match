import { Image } from './image-service';
import { Id } from './utils/id-generator';

export type Card = {
  id: Id;
  getImage: () => Promise<Image>;
  pairId: Id;
  reveal: () => void;
  state: 'hidden' | 'paired' | 'revealed';
};
