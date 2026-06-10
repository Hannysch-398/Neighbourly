export type PostType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING';

export type PostMode = 'OFFER' | 'REQUEST';

export type LocationPrecision = 'EXACT' | 'POSTAL_CODE';

export interface CreatePostLocationDto {
  city: string;
  postalCode: string;
  address: string | null;
  lat: number;
  lng: number;
  precision: LocationPrecision;
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
  skillTags: string[];
  availabilityNote: string;
  experienceLevel: string;
}

export interface ProductDetails {
  detailType: 'PRODUCT';
  productName: string;
  price: number | null;
  currency: string;
  condition: string;
}

export interface HousingDetails {
  detailType: 'HOUSING';
  housingType: string;
  rent: number | null;
  rooms: number | null;
  availableFrom: string;
}

export type PostDetails =
  | EventDetails
  | SkillDetails
  | ProductDetails
  | HousingDetails;

export interface GeoCoordinatesResponse {
  latitude: number;
  longitude: number;
  city: string;
}

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
  postMode: PostMode;
  isUrgent: boolean;
  urgentUntil?: string | null;
  location: CreatePostLocationDto;
  details: PostDetails;
}
