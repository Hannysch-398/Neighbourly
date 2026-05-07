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
  ratingSummary?: RatingSummaryDto | null;
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

export interface RatingSummaryDto {
  averageRating: number;
  ratingAmount: number;
}

export interface ReportSummaryDto {
  reportCount: number;
}
