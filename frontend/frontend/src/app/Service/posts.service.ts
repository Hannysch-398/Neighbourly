import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { PostResponse } from '../models/post.model';
import { postListMock } from '../mocks/post.mock';
import { postDetailMock } from  '../mocks/post-detail.mock'
import { PostDetailResponse } from '../models/post-detail.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/posts';
  private readonly useMockPosts = true;

  getPosts(): Observable<PostResponse[]> {
    if (this.useMockPosts) {
      return of(postListMock);
    }

    return this.http.get<PostResponse[]>(this.apiUrl).pipe(
      catchError(() => of(postListMock))
    );
  }
  getPostById(id: number): Observable<PostDetailResponse> {
    if (this.useMockPosts) {
      return of(postDetailMock);
    }
    return this.http.get<PostDetailResponse>(`${this.apiUrl}/${id}`);
  }
}
