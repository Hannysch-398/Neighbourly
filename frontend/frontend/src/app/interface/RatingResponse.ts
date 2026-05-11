export interface RatingResponse {
  id: number;
  raterUserId: number;
  ratedUserId: number;
  rating: number;
  comment: string;
  creationDate: string;
}

// {
//   "raterUserId": 1,
//   "ratedUserId": 2,
//   "rating": 5,
//   "comment": "Sehr gute Erfahrung!",
//   "creationDate": "2026-04-15T12:00:00"
// }
