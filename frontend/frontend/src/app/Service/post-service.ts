import { Injectable } from '@angular/core';
import {RatingResponse} from '../interface/RatingResponse';
import {HttpClient} from '@angular/common/http';
import {PostResponse} from '../models/post.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'http://localhost:8080/api/posts';
  constructor(private http: HttpClient) {}

  getMapPosts(lat: number, lng: number, radius: number):Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(
      `${this.baseUrl}/?lat=${lat}&lng=${lng}&radius=${radius}`,
    );
  }
}
