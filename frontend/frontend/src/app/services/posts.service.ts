import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {postListMock} from '../mocks/post.mock';
import {MapPostMarker} from '../interface/MapPostMarker';
import {MOCK_MAP_POST_MARKERS} from '../mocks/mapPost.mock';
import { CreatePostRequest, PostResponse } from '../models/post.model';


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

  getMockMapPosts(): MapPostMarker[] {
    return MOCK_MAP_POST_MARKERS;
  }

  getMapPostMarker(lat: number, lng: number, radius: number): Observable<MapPostMarker[]> {
    let params = new HttpParams();

    if (lat !== undefined && lng !== undefined && radius !== undefined) {
      params = params
        .set('lat', lat.toString())
        .set('lng', lng.toString())
        .set('radius', radius.toString());
    }

    return this.http.get<MapPostMarker[]>(`${this.apiUrl}/marker`, {params});
  }

  createPost(payload: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, payload);
  }

}
