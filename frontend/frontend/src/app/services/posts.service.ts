import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MapPostMarker } from '../interface/MapPostMarker';
import { MOCK_MAP_POST_MARKERS } from '../mocks/mapPost.mock';
import { postListMock } from '../mocks/post.mock';
import { CreatePostRequest, PostResponse } from '../models/post.model';
import {UpdatePostRequest} from '../models/update-post-request.model';
import {PostDetailResponse} from '../models/post-detail.model';
import {postDetailMock} from '../mocks/post-detail.mock';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/posts';
  private readonly useMockPosts = false;
  private readonly maxRadius = 150_000;

  readonly mapPosts = signal<MapPostMarker[]>([]);
  readonly selectedMapPost = signal<MapPostMarker | null>(null);

  getPosts(): Observable<PostResponse[]> {
    if (this.useMockPosts) {
      return of(postListMock);
    }

    return this.http.get<PostResponse[]>(this.apiUrl);
  }

  selectMapPost(post: MapPostMarker | null): void {
    this.selectedMapPost.set(post);
  }

  loadMapPostMarkers(lat: number, lng: number, radius: number): void {
    if (this.useMockPosts) {
      this.mapPosts.set(MOCK_MAP_POST_MARKERS);
      return;
    }

    const safeRadius = this.normalizeRadius(radius);

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', safeRadius.toString());

    this.http
      .get<MapPostMarker[]>(`${this.apiUrl}/marker`, { params })
      .subscribe((posts) => {
        this.mapPosts.set(posts);
      });
  }

  createPost(payload: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, payload);
  }

  private normalizeRadius(radius: number): number {
    if (!Number.isFinite(radius)) {
      return this.maxRadius;
    }

    return Math.max(1, Math.min(Math.round(radius), this.maxRadius));
  }

  updatePost(id: number, payload: UpdatePostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, payload);}

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);}

  getPostById(id: number): Observable<PostDetailResponse> {
    if (this.useMockPosts) {
      return of(postDetailMock);
    }
    return this.http.get<PostDetailResponse>(`${this.apiUrl}/${id}`);
  }
}
