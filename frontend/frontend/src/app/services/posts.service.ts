import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
import { UpdatePostRequest } from '../models/update-post-request.model';

export interface MapMarkerQuery {
  lat: number;
  lng: number;
  radius: number;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string>;
}

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

  updatePost(id: number, payload: UpdatePostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deletePost(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  resolvePostMutationError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Die Anfrage konnte nicht verarbeitet werden.';
    }

    const apiError = error.error as Partial<ApiErrorResponse> | null;
    const firstFieldError = apiError?.errors ? Object.values(apiError.errors)[0] : undefined;

    if (error.status === 403) {
      return firstFieldError || apiError?.message || 'Du darfst diesen Beitrag nicht bearbeiten oder löschen.';
    }

    if (error.status === 404) {
      return firstFieldError || apiError?.message || 'Der Beitrag wurde nicht gefunden.';
    }

    return firstFieldError || apiError?.message || 'Die Änderung konnte nicht gespeichert werden.';
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
