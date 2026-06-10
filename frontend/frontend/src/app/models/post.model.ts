export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';
export type PostMode = 'OFFER' | 'REQUEST';
export type PostStatus = 'ACTIVE' | 'ARCHIVED' | string;

export interface LocationDto {
  city: string;
  postalCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  precision?: string | null;
  radiusM?: number | null;
}

export interface CreatePostLocationDto {
  city: string;
  postalCode: string;
  address: string | null;
  lat: number;
  lng: number;
  precision: 'EXACT' | 'POSTAL_CODE';
  radiusM: number;
}

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
  postMode: PostMode;
  isUrgent: boolean;
  urgentUntil?: string | null;
  location: CreatePostLocationDto;
  details: PostDetailsDto;
}
export interface GeoCoordinatesResponse {
  latitude: number;
  longitude: number;
  city: string;
}

export interface EventDetailsDto {
  detailType: 'EVENT';
  startDate: string;
  endDate: string;
  venue: string;
}

export interface SkillDetailsDto {
  detailType: 'SKILL';
  skillName: string;
  skillTags: string[];
  availabilityNote: string;
  experienceLevel: string;
}

export interface ProductDetailsDto {
  detailType: 'PRODUCT';
  productName: string;
  price: number | null;
  currency: string;
  condition: string;
}

export interface HousingDetailsDto {
  detailType: 'HOUSING';
  housingType: string;
  rent: number | null;
  rooms: number | null;
  availableFrom: string;
}

export type PostDetailsDto = EventDetailsDto | SkillDetailsDto | ProductDetailsDto | HousingDetailsDto;

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
  location?: LocationDto | null;
}

export const MARKER_ICONS: Record<PostType, string> = {
  EVENT: '📅',
  SKILL: '🛠️',
  PRODUCT: '📦',
  HOUSING: '🏠',
};

export const MODE_ICONS: Record<PostMode, string> = {
  REQUEST: '❓',
  OFFER: '❗',
};
