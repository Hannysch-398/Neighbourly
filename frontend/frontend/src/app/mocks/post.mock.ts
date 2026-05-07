import { CreatePostRequest, PostResponse } from '../models/post.model';

export const createPostMock: CreatePostRequest = {
  title: 'Hilfe beim Umzug',
  description: 'Ich brauche Hilfe beim Tragen von Möbeln.',
  type: 'SKILL',
  isUrgent: true,
  urgentUntil: '2026-05-10T18:00:00'
};

export const postResponseMock: PostResponse = {
  id: 1,
  title: 'Hilfe beim Umzug',
  description: 'Ich brauche Hilfe beim Tragen von Möbeln.',
  type: 'SKILL',
  isUrgent: true,
  urgentUntil: '2026-05-10T18:00:00',
  createdAt: '2026-05-05T11:30:00'
};
