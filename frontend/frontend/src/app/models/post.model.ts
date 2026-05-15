export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';

export interface CreatePostLocationRequest {
  address: string;
  precision: 'EXACT' | 'RADIUS';
  latitude?: number;
  longitude?: number;
  radiusM?: number | null;

}

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
  isUrgent: boolean;
  urgentUntil?: string | null;
  location?: CreatePostLocationRequest | null;
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
