export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
  isUrgent: boolean;
  urgentUntil?: string | null;
}

export interface PostResponse {
  id: number;
  title: string;
  description: string;
  type: PostType;
  isUrgent: boolean;
  urgentUntil?: string | null;
  createdAt: string;
}
