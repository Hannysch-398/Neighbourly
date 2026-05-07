import {AverageRatingResponse} from "../interface/AverageRatingResponse";

export interface PostDetailResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  isUrgent: boolean;
  urgentUntil?: string | null;
  createdAt: string;
  location: LocationDto;
  tags: string[];
  images: PostImageDto[];
  details: unknown;
  averageRatingResponse?: AverageRatingResponse | null;
  reportSummary?: ReportSummaryDto | null;
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

export interface AverageRatingDto {
  average: number;
  ratingAmount: number;
}

export interface ReportSummaryDto {
  reportCount: number;
}
