import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MapPostMarker } from '../interface/MapPostMarker';
import { MOCK_MAP_POST_MARKERS } from '../mocks/mapPost.mock';
import { postListMock } from '../mocks/post.mock';
import { CreatePostRequest, PostResponse } from '../models/post.model';
import {PostDetailResponse} from '../models/post-detail.model';
import {postDetailMock} from '../mocks/post-detail.mock';

export interface MapMarkerQuery {
  lat: number;
  lng: number;
  radius: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/posts';
  private readonly useMockPosts = true;
  private readonly maxRadius = 150_000;

  private readonly mapPostsSubject = new BehaviorSubject<MapPostMarker[]>([]);
  readonly mapPosts$ = this.mapPostsSubject.asObservable();

  getPosts(): Observable<PostResponse[]> {
    if (this.useMockPosts) {
      return of(postListMock);
    }

    return this.http.get<PostResponse[]>(this.apiUrl);
  }

  loadMapPostMarkers(lat: number, lng: number, radius: number): void {
    if (this.useMockPosts) {
      this.mapPostsSubject.next(MOCK_MAP_POST_MARKERS);
      return;
    }

    const safeRadius = this.normalizeRadius(radius);

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', safeRadius.toString());

    this.http.get<MapPostMarker[]>(`${this.apiUrl}/marker`, { params })
      .subscribe((posts) => {
        this.mapPostsSubject.next(posts);
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

  getPostById(id: number): Observable<PostDetailResponse> {
    if (this.useMockPosts) {
      return of(postDetailMock);
    }
    return this.http.get<PostDetailResponse>(`${this.apiUrl}/${id}`);
  }
}
