import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AverageRatingResponse } from '../interface/AverageRatingResponse';
import {RatingResponse} from '../interface/RatingResponse';
import {RatingRequest} from '../interface/RatingReques';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAverageRating(userId: number): Observable<AverageRatingResponse> {
    return this.http.get<AverageRatingResponse>(
      `${this.baseUrl}/${userId}/ratings/average`
    );
  }

  getAllRatingsForUser(userId: number): Observable<RatingResponse[]> {
    return this.http.get<RatingResponse[]>(
      `${this.baseUrl}/${userId}/ratings`
    );
  }

  getRating(userId: number, ratingId: number): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(
      `${this.baseUrl}/${userId}/ratings/${ratingId}`
    );
  }

  postRating(userId: number, ratingRequest: RatingRequest): Observable<RatingResponse> {
    return this.http.post<RatingResponse>(
      `${this.baseUrl}/${userId}/ratings`,
      ratingRequest
    );
  }
}
