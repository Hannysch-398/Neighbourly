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

  getCoordinates(
    plz: string,
    city: string,
    address?: string | null
  ): Observable<GeoCoordinatesResponse> {

    let params = new HttpParams()
      .set('plz', plz.trim())
      .set('city', city.trim());

    if (address?.trim()) {
      params = params.set('address', address.trim());
    }

    return this.http.get<GeoCoordinatesResponse>(this.apiUrl, { params });
  }
}
