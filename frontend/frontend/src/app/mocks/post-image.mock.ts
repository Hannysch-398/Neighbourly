import { PostImage, ReorderPostImagesRequest } from '../models/post-image.model';

export const mockPostImages: PostImage[] = [
  {
    id: 1,
    url: 'https://example.com/images/neighbourly-post-1.jpg',
    altText: 'Gemeinschaftsgarten mit Hochbeeten',
    orderIndex: 0,
    createdAt: '2026-06-01T12:00:00',
  },
  {
    id: 2,
    url: 'https://example.com/images/neighbourly-post-2.jpg',
    altText: 'Werkzeugkiste für Nachbarschaftshilfe',
    orderIndex: 1,
    createdAt: '2026-06-01T12:05:00',
  },
  {
    id: 3,
    url: 'https://example.com/images/neighbourly-post-3.jpg',
    altText: null,
    orderIndex: 2,
    createdAt: '2026-06-01T12:10:00',
  },
];

export const mockReorderPostImagesRequest: ReorderPostImagesRequest = {
  imageIds: [3, 1, 2],
};
