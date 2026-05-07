import { PostDetailResponse } from '../models/post-detail.model';

export const postDetailMock: PostDetailResponse = {
  id: 1,
  title: 'Need help repairing my bike',
  description: 'My bike chain is broken and I need help fixing it.',
  type: 'HELP_REQUEST',
  isUrgent: true,
  urgentUntil: '2026-05-10T18:00:00',
  createdAt: '2026-05-07T10:30:00',
  location: {
    city: 'Berlin',
    district: 'Mitte',
    latitude: 52.52,
    longitude: 13.405,
  },
  tags: ['bike', 'repair', 'help'],
  images: [
    {
      id: 1,
      url: 'https://example.com/images/bike.jpg',
      altText: 'Broken bike chain',
    },
  ],
  details: {
    requestedHelpType: 'REPAIR',
    preferredTime: 'Evening',
  },
  ratingSummary: {
    averageRating: 4.5,
    ratingCount: 12,
  },
  reportSummary: {
    reportCount: 0,
  },
};
