import {AverageRatingResponse} from "../interface/AverageRatingResponse";

export interface PostDetailResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  isUrgent: boolean;
  urgentUntil?: string | null;
  createdAt: string;
  location?: LocationDto;
  tags: string[];
  images: PostImageDto[];
  details?: unknown;
  reportSummary?: ReportSummaryDto | null;
  averageRating?: AverageRatingResponse | null;
}

export interface LocationDto {
  city: string;
  postalCode?: string | null;
  address?: string | null;
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
