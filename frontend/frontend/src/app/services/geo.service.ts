import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GeoCoordinatesResponse} from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/geo/coordinates';

  getCoordinatesByPlz(plz: string): Observable<GeoCoordinatesResponse> {
    const params = new HttpParams().set('plz', plz.trim());

    return this.http.get<GeoCoordinatesResponse>(this.apiUrl, {params});
  }
}
