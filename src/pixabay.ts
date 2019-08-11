import { prop } from 'ramda';

type PixabayImage = {
  id: string;
  webformatURL: string;
};

type PixabayResponse = {
  hits: PixabayImage[];
};

export function getPixabayImages(
  query: string,
  page: number,
): Promise<PixabayImage[]> {
  return fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&min_width=400&min_height=400&q=${query}&page=${page}`,
    { mode: 'cors' },
  )
    .then<PixabayResponse>(response => response.json())
    .then(prop('hits'));
}
