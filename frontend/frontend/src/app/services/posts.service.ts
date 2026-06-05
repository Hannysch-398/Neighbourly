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

type MapPostsState = 'loading' | 'empty' | 'error' | 'ready';

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
  readonly mapPostsState = signal<MapPostsState>('loading');
  readonly mapPostsError = signal('');


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
    this.mapPostsState.set('loading');
    this.mapPostsError.set('');

    if (this.useMockPosts) {
      this.mapPosts.set(MOCK_MAP_POST_MARKERS);
      this.mapPostsState.set(MOCK_MAP_POST_MARKERS.length === 0 ? 'empty' : 'ready');
      return;
    }

    const safeRadius = this.normalizeRadius(radius);

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', safeRadius.toString());

    this.http
      .get<MapPostMarker[]>(`${this.apiUrl}/marker`, { params })
      .subscribe({
        next: (posts) => {
          this.mapPosts.set(posts);
          this.mapPostsState.set(posts.length === 0 ? 'empty' : 'ready');

          const selectedPost = this.selectedMapPost();

          if (selectedPost && !posts.some((post) => post.id === selectedPost.id)) {
            this.selectedMapPost.set(null);
          }
        },
        error: () => {
          this.mapPosts.set([]);
          this.selectedMapPost.set(null);
          this.mapPostsError.set('Beiträge auf der Karte konnten nicht geladen werden.');
          this.mapPostsState.set('error');
        },
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
