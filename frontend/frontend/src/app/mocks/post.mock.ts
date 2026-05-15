import { CreatePostRequest, PostResponse } from '../models/post.model';

export const createPostMock: CreatePostRequest = {
  title: 'Hilfe beim Umzug',
  description: 'Ich brauche Hilfe beim Tragen von Moebeln.',
  type: 'SKILL',
  isUrgent: true,
  urgentUntil: '2026-05-10T18:00:00',
};

export const postResponseMock: PostResponse = {
  id: 1,
  title: 'Hilfe beim Umzug',
  description: 'Ich brauche Hilfe beim Tragen von Moebeln.',
  type: 'SKILL',
  postMode: 'REQUEST',
  isUrgent: true,
  urgentUntil: '2026-05-10T18:00:00',
  createdAt: '2026-05-05T11:30:00',
  metadata: {
    status: 'ACTIVE',
    updatedAt: '2026-05-05T11:30:00',
    locationLabel: null,
  },
};

export const postListMock: PostResponse[] = [
  postResponseMock,
  {
    id: 2,
    title: 'Kinderfahrrad abzugeben',
    description: 'Gut erhaltenes Fahrrad fuer Kinder bis etwa 8 Jahre.',
    type: 'PRODUCT',
    postMode: 'OFFER',
    isUrgent: false,
    urgentUntil: null,
    createdAt: '2026-05-04T16:15:00',
    metadata: {
      status: 'ACTIVE',
      updatedAt: '2026-05-04T16:15:00',
      locationLabel: null,
    },
  },
  {
    id: 3,
    title: 'Mitspieler fuer Hof-Flohmarkt gesucht',
    description: 'Wir planen einen kleinen Flohmarkt im Innenhof und suchen weitere Staende.',
    type: 'EVENT',
    postMode: 'REQUEST',
    isUrgent: false,
    urgentUntil: null,
    createdAt: '2026-05-03T09:00:00',
    metadata: {
      status: 'ACTIVE',
      updatedAt: '2026-05-03T09:00:00',
      locationLabel: null,
    },
  },
];
