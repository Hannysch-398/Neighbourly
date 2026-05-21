import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PostDetailResponse } from '../models/post-detail.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/posts';

  getPostById(id: number): Observable<PostDetailResponse> {
    return this.http.get<PostDetailResponse>(`${this.apiUrl}/${id}`);
  }
}
