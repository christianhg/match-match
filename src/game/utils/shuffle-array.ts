export function shuffleArray<A>(array: A[]): A[] {
  let randomIndex: number;
  let itemToShuffle: A;
  let length = array.length;
  const shuffledArray = array.slice();

  while (length) {
    randomIndex = Math.floor(Math.random() * length--);
    itemToShuffle = shuffledArray[length];
    shuffledArray[length] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = itemToShuffle;
  }

  return shuffledArray;
}
