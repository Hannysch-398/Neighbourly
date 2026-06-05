import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { postListMock } from '../mocks/post.mock';
import { MapPostMarker } from '../interface/MapPostMarker';
import { MOCK_MAP_POST_MARKERS } from '../mocks/mapPost.mock';
import { CreatePostRequest, PostResponse } from '../models/post.model';
import { Router } from '@angular/router';
import { UpdatePostRequest } from '../models/update-post-request.model';
import { PostDetailResponse } from '../models/post-detail.model';
import { postDetailMock } from '../mocks/post-detail.mock';

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
  private readonly useMockPosts = true;

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
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }

        return of([]);
      }),
    );
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
