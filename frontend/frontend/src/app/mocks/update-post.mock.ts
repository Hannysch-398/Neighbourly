import { UpdatePostRequest } from '../models/update-post-request.model';

export const updatePostMock: UpdatePostRequest = {
  title: 'Updated title',
  description: 'Updated description',
  isUrgent: true,
  urgentUntil: '2026-06-01T18:00:00'
};
