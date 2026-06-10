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

  getCoordinatesByAddress(
    address: string,
    postalCode: string,
    city: string,
  ): Observable<GeoCoordinatesResponse> {
    const params = new HttpParams()
      .set('plz', postalCode.trim())
      .set('city', city.trim())
      .set('address', address.trim());

    return this.http.get<GeoCoordinatesResponse>(this.apiUrl, {params});
  }
}
