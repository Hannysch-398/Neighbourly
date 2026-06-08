import {AverageRatingResponse} from "../interface/AverageRatingResponse";
import { PostImage } from './post-image.model';

export interface PostDetailResponse {
  id: number;
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
}

export interface LocationDto {
  city: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface ReportSummaryDto {
  reportCount: number;
}
