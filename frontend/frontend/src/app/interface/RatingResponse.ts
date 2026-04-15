export interface RatingResponse {
  id: number;
  raterUserId: number;
  ratedUserId: number;
  rating: number;
  comment: string;
  creationDate: string;
}
