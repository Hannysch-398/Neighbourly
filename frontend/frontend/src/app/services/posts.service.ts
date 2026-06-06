import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of ,catchError, throwError, tap} from 'rxjs';
import { MapPostMarker } from '../interface/MapPostMarker';
import { MOCK_MAP_POST_MARKERS } from '../mocks/mapPost.mock';
import { postListMock } from '../mocks/post.mock';
import { CreatePostRequest, PostResponse } from '../models/post.model';
import {UpdatePostRequest} from '../models/update-post-request.model';
import {PostDetailResponse} from '../models/post-detail.model';
import {postDetailMock} from '../mocks/post-detail.mock';
import { Router } from '@angular/router';

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

  private readonly maxRadius = 150_000;

  readonly mapPosts = signal<MapPostMarker[]>([]);
  readonly selectedMapPost = signal<MapPostMarker | null>(null);

  private readonly router = inject(Router);
  //toggle to see mock or real posts
  private readonly useMockPosts = false;

  getPosts(): Observable<PostResponse[]> {
    if (this.useMockPosts) {
      return of(postListMock);
    }

    return this.http.get<PostResponse[]>(this.apiUrl);
  }

  selectMapPost(post: MapPostMarker | null): void {
    this.selectedMapPost.set(post);
  }

  loadMapPostMarkers(lat: number, lng: number, radius: number): Observable<MapPostMarker[]> {
    if (this.useMockPosts) {
      this.mapPosts.set(MOCK_MAP_POST_MARKERS);
      return of(MOCK_MAP_POST_MARKERS);
    }

    const safeRadius = this.normalizeRadius(radius);

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', safeRadius.toString());

    return this.http.get<MapPostMarker[]>(`${this.apiUrl}/marker`, { params }).pipe(
      tap((posts) => this.mapPosts.set(posts)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }

        this.mapPosts.set([]);
        return of([]);
      }),
    );
  }

  createPost(payload: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, payload);
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
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPostById(id: number): Observable<PostDetailResponse | null> {
    if (this.useMockPosts) {
      return of(postDetailMock);
    }

    return this.http.get<PostDetailResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['/404']);
          return of(null);
        }

        return throwError(() => error);
      }),
    );
  }
}
