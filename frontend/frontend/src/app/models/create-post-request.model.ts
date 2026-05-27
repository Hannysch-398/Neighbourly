export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';

export type PostMode = 'OFFER' | 'REQUEST';

export interface CreatePostLocation {
  lat: number;
  lng: number;
  precision: string;
  radius_m: number;
}

export interface EventDetails {
  detailType: 'EVENT';
  startDate: string;
  endDate: string;
  venue: string;
}

export interface SkillDetails {
  detailType: 'SKILL';
  skillName: string;
  experienceLevel: string;
}

export interface ProductDetails {
  detailType: 'PRODUCT';
  productName: string;
  price: number;
}

export interface HousingDetails {
  detailType: 'HOUSING';
  housingType: string;
  rent: number;
  rooms: number;
  availableFrom: string;
}

export type PostDetails =
  | EventDetails
  | SkillDetails
  | ProductDetails
  | HousingDetails;

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
  postMode: PostMode;
  isUrgent: boolean;
  urgentUntil?: string | null;
  location: CreatePostLocation;
  details: PostDetails;
}
