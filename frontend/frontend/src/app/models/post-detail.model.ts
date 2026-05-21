import {AverageRatingResponse} from "../interface/AverageRatingResponse";

export interface PostDetailResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  isUrgent: boolean;
  urgentUntil?: string | null;
  createdAt: string;
  location?: LocationDto | null;
  tags: string[];
  images: PostImageDto[];
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

export interface PostImageDto {
  id: number;
  url: string;
  altText: string;
}


export interface ReportSummaryDto {
  reportCount: number;
}
