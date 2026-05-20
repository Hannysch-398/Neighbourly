export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';
export type PostMode = 'OFFER' | 'REQUEST' | string;
export type PostStatus = 'ACTIVE' | 'ARCHIVED' | string;

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
  postMode: PostMode;
  isUrgent: boolean;
  urgentUntil?: string | null;
  createdAt: string;
  status: PostStatus;
  updatedAt: string;
}
