import {PostDetailResponse} from '../models/post-detail.model';

export const postDetailMock: PostDetailResponse = {
    id: 1,
    title: 'Need help repairing my bike',
    description: 'My bike chain is broken and I need help fixing it.',
    type: 'SKILL',
    postMode: 'REQUEST',
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
            url: 'https://picsum.photos/id/237/200/300',
            altText: 'Broken bike chain',
            orderIndex: 0,
            createdAt: '2026-05-07T10:35:00',
        },
      {
        id: 2,
        url: 'https://picsum.photos/id/238/200/300',
        altText: 'Broken bike chain 2',
        orderIndex: 1,
        createdAt: '2026-05-07T10:36:00',
      },
    ],
    details: {
        requestedHelpType: 'REPAIR',
        preferredTime: 'Evening',
    },

    reportSummary: {
        reportCount: 0,
    },
};
