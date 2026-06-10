import { CreatePostRequest } from '../models/create-post-request.model';
import { PostResponse } from '../models/post.model';

// export const createPostMock: CreatePostRequest = {
//   title: 'Hilfe beim Umzug',
//   description: 'Ich brauche Hilfe beim Tragen von Möbeln.',
//   type: 'SKILL',
//   postMode: 'REQUEST',
//   isUrgent: true,
//   urgentUntil: '2026-05-10T18:00:00',
//   location: {
//     lat: 53.0793,
//     lng: 8.8017,
//     precision: 'POSTAL_CODE',
//     radius_m: 500
//   },
//   details: {
//     detailType: 'SKILL',
//     skillName: 'Umzugshilfe',
//     experienceLevel: 'BEGINNER'
//   }
// };

export const postResponseMock: PostResponse = {
  id: 1,
  title: 'Hilfe beim Umzug',
  description: 'Ich brauche Hilfe beim Tragen von Möbeln.',
  type: 'SKILL',
  postMode: 'REQUEST',
  isUrgent: true,
  urgentUntil: '2026-05-10T18:00:00',
  createdAt: '2026-05-05T11:30:00',
  status: 'ACTIVE',
  updatedAt: '2026-05-05T11:30:00',
};

export const postListMock: PostResponse[] = [
  postResponseMock,
  {
    id: 2,
    title: 'Kinderfahrrad abzugeben',
    description: 'Gut erhaltenes Fahrrad für Kinder bis etwa 8 Jahre.',
    type: 'PRODUCT',
    postMode: 'OFFER',
    isUrgent: false,
    urgentUntil: null,
    createdAt: '2026-05-04T16:15:00',
    status: 'ACTIVE',
    updatedAt: '2026-05-04T16:15:00',
  },
  {
    id: 3,
    title: 'Mitspieler für Hof-Flohmarkt gesucht',
    description: 'Wir planen einen kleinen Flohmarkt im Innenhof und suchen weitere Stände.',
    type: 'EVENT',
    postMode: 'REQUEST',
    isUrgent: false,
    urgentUntil: null,
    createdAt: '2026-05-03T09:00:00',
    status: 'ACTIVE',
    updatedAt: '2026-05-03T09:00:00',
  },
];
