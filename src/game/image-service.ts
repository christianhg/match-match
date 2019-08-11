import { prop } from 'ramda';

export type Image = {
  src: string;
};

type ExternalImageProvider<ExternalImage> = {
  getImages: (query: string, page: number) => Promise<ExternalImage[]>;
  converter: (externalImage: ExternalImage) => Image;
};

export type ImageService = {
  getImage(id: string): Promise<Image>;
};

export function createImageService<ExternalImage>(
  query: string,
  externalImageProvider: ExternalImageProvider<ExternalImage>,
): ImageService {
  const imageCache = new Map<string, Promise<Image>>();
  const imageStream = createImageStream(query, externalImageProvider);

  function getImage(id: string): Promise<Image> {
    const cachedImage = imageCache.get(id);

    if (cachedImage) {
      return cachedImage;
    }

    const image = imageStream.next().then(prop('value'));

    imageCache.set(id, image);

    return image;
  }

  return {
    getImage,
  };
}

async function* createImageStream<ExternalImage>(
  query: string,
  externalImageProvider: ExternalImageProvider<ExternalImage>,
) {
  let page = 1;

  while (true) {
    const images = (await externalImageProvider.getImages(query, page)).map(
      externalImageProvider.converter,
    );

    for (const image of images) {
      yield image;
    }

    page = page + 1;
  }
}
