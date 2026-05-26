import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostRequest } from '../models/create-post-request.model';
import { PostResponse } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly apiUrl = '/api/posts';

  constructor(private http: HttpClient) {}

  createPost(request: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, request);
  }
}
