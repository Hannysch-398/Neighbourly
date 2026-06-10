import {AverageRatingResponse} from "../interface/AverageRatingResponse";
import { PostImage } from './post-image.model';

export interface PostDetailResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: string;
  postMode: string;
  isUrgent: boolean;
  urgentUntil?: string | null;
  createdAt: string;
  location?: LocationDto;
  tags: string[];
  images: PostImage[];
  details?: unknown;
  reportSummary?: ReportSummaryDto | null;
  averageRating?: AverageRatingResponse | null;
  isOwner?: boolean;
  owner?: PostOwnerDto | null;
  author?: PostOwnerDto | null;
  user?: PostOwnerDto | null;
  userEmail?: string | null;
}

export interface LocationDto {
  city: string;
  district?: string | null;
  postalCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  precision?: string | null;
  radiusM?: number | null;
}

export interface ReportSummaryDto {
  reportCount: number;
}

export interface PostOwnerDto {
  email?: string | null;
  username?: string | null;
  name?: string | null;
}
