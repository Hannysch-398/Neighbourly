export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';

export type PostMode = 'OFFER' | 'REQUEST';

export interface EventDetails {
  eventDate: string;
  locationName: string;
}

export interface SkillDetails {
  skillName: string;
  experienceLevel: string;
}

export interface ProductDetails {
  productName: string;
  price: number;
}

export interface HousingDetails {
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
  details: PostDetails;
}
