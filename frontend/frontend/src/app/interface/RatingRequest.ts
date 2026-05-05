export interface RatingRequest {
  raterUserId: number;
  ratedUserId: number;
  rating: number;
  comment: string;
  creationDate: string;
}
