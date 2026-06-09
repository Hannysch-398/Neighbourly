import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, Observable, of, catchError, throwError, tap} from 'rxjs';
import {MapPostMarker} from '../interface/MapPostMarker';
import {MOCK_MAP_POST_MARKERS} from '../mocks/mapPost.mock';
import {postListMock} from '../mocks/post.mock';
import {CreatePostRequest, PostResponse} from '../models/post.model';
import {UpdatePostRequest} from '../models/update-post-request.model';
import {PostDetailResponse} from '../models/post-detail.model';
import {postDetailMock} from '../mocks/post-detail.mock';
import {Router} from '@angular/router';

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

type MapPostsState = 'loading' | 'empty' | 'error' | 'ready';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/posts';

  private readonly maxRadius = 150_000;

  readonly mapPosts = signal<MapPostMarker[]>([]);
  readonly selectedMapPost = signal<MapPostMarker | null>(null);
  readonly mapPostsState = signal<MapPostsState>('loading');
  readonly mapPostsError = signal('');

  private readonly router = inject(Router);
  //toggle to see mock or real posts
  private readonly useMockPosts = false;

  getPosts(): Observable<PostResponse[]> {
    if (this.useMockPosts) {
      return of(postListMock);
    }

    return this.http.get<PostResponse[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }

        return of([]);
      }),
    );
  }

  selectMapPost(post: MapPostMarker | null): void {
    this.selectedMapPost.set(post);
  }

  loadMapPostMarkers(lat: number, lng: number, radius: number): Observable<MapPostMarker[]> {
    this.mapPostsState.set('loading');
    this.mapPostsError.set('');

    if (this.useMockPosts) {
      this.mapPosts.set(MOCK_MAP_POST_MARKERS);
      this.mapPostsState.set(MOCK_MAP_POST_MARKERS.length === 0 ? 'empty' : 'ready');
      return of(MOCK_MAP_POST_MARKERS);
    }

    const safeRadius = this.normalizeRadius(radius);

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', safeRadius.toString());

    return this.http.get<MapPostMarker[]>(`${this.apiUrl}/marker`, {params}).pipe(
      tap((posts) => {
        this.mapPosts.set(posts);
        this.mapPostsState.set(posts.length === 0 ? 'empty' : 'ready');

        const selectedPost = this.selectedMapPost();

        if (selectedPost && !posts.some((post) => post.id === selectedPost.id)) {
          this.selectedMapPost.set(null);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }

        this.mapPosts.set([]);
        this.selectedMapPost.set(null);
        this.mapPostsError.set('Beiträge auf der Karte konnten nicht geladen werden.');
        this.mapPostsState.set('error');

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
      return (
        firstFieldError ||
        apiError?.message ||
        'Du darfst diesen Beitrag nicht bearbeiten oder löschen.'
      );
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

        return this.http.get<PostDetailResponse>(`${this.apiUrl}/${id}`);
      }),
    );
  }

  getPostsByUserId(userId: number): Observable<PostResponse[]> {
    if (this.useMockPosts) {
      return of(postListMock);
    }

    return this.http.get<PostResponse[]>(`${this.apiUrl}/user/${userId}`);
  }
}
