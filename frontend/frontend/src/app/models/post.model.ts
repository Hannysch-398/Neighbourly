export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';
export type PostMode = 'OFFER' | 'REQUEST';
export type PostStatus = 'ACTIVE' | 'ARCHIVED' | string;

export interface LocationDto {
  city: string;
  district?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface EventDetails {
  startDate: string;
  endDate: string;
  venue: string;
}

export interface SkillDetails {
  skillName: string;
  experienceLevel: string;
}

export interface ProductDetails {
  productName: string;
  price: number | null;
}

export interface HousingDetails {
  housingType: string;
  rent: number | null;
}

export type PostDetails = EventDetails | SkillDetails | ProductDetails | HousingDetails;

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
  postMode: PostMode;
  isUrgent: boolean;
  urgentUntil?: string | null;
  location?: LocationDto | null;
  details?: PostDetails | null;
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

