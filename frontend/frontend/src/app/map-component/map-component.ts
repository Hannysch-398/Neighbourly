import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import * as L from 'leaflet';

import {PostsService as PostService} from '../service/posts.service';
import {createMapMarkerIcon} from '../map-marker/map-marker';

@Component({
  selector: 'app-modern-map',
  standalone: true,
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', {static: true}) mapElement!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private postMarkersLayer = L.layerGroup();
  private markerLoadTimeout?: ReturnType<typeof setTimeout>;

  private readonly defaultPosition: L.LatLngExpression = [53.088559, 8.79568];
  private readonly defaultZoom = 13;
  private readonly userZoom = 15;

  constructor(
    private readonly postService: PostService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngAfterViewInit(): void {
    this.resolveInitialPosition().then(({position, zoom}) => {
      this.initMap(position, zoom);
    });
  }

  private resolveInitialPosition(): Promise<{
    position: L.LatLngExpression;
    zoom: number;
  }> {
    const queryView = this.getInitialMapViewFromQuery();

    if (queryView) {
      return Promise.resolve(queryView);
    }

    if (!navigator.geolocation) {
      return Promise.resolve({
        position: this.defaultPosition,
        zoom: this.defaultZoom,
      });
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            position: [
              position.coords.latitude,
              position.coords.longitude,
            ],
            zoom: this.userZoom,
          });
        },
        () => {
          resolve({
            position: this.defaultPosition,
            zoom: this.defaultZoom,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60_000,
        }
      );
    });
  }

  private getInitialMapViewFromQuery(): {position: L.LatLngExpression; zoom: number} | null {
    const params = this.route.snapshot.queryParamMap;
    const lat = Number(params.get('lat'));
    const lng = Number(params.get('lng'));
    const zoom = Number(params.get('zoom'));

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Number.isFinite(zoom) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      zoom >= 1 &&
      zoom <= 20
    ) {
      return {
        position: [lat, lng],
        zoom,
      };
    }

    return null;
  }

  private initMap(position: L.LatLngExpression, zoom: number): void {
    this.map = L.map(this.mapElement.nativeElement, {
      zoomControl: false,
      attributionControl: true,
    }).setView(position, zoom);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }
    ).addTo(this.map);

    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(this.map);

    this.postMarkersLayer.addTo(this.map);

    this.addStartMarker(position);
    this.loadMarkersForCurrentView();

    this.map.on('moveend', () => {
      this.updateMapViewQueryParams();
      this.debouncedLoadMarkers();
    });

    this.updateMapViewQueryParams();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  private addStartMarker(position: L.LatLngExpression): void {
    if (!this.map) {
      return;
    }

    const startIcon = L.divIcon({
      className: 'modern-marker marker-default',
      html: `
        <div class="marker-pin">
          <div class="marker-dot"></div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -38],
    });

    L.marker(position, {
      icon: startIcon,
    })
      .addTo(this.map)
      .bindPopup(`
        <div class="custom-popup">
          <strong>Startposition</strong>
        </div>
      `);
  }

  private debouncedLoadMarkers(): void {
    if (this.markerLoadTimeout) {
      clearTimeout(this.markerLoadTimeout);
    }

    this.markerLoadTimeout = setTimeout(() => {
      this.loadMarkersForCurrentView();
    }, 250);
  }

  private loadMarkersForCurrentView(): void {
    if (!this.map) {
      return;
    }

    const center = this.map.getCenter();
    const radius = this.getRadiusByZoom(this.map.getZoom());

    this.postService
      .getMapPostMarker(center.lat, center.lng, radius)
      .subscribe((posts) => {

        this.postMarkersLayer.clearLayers();

        posts.forEach((post) => {
          const marker = L.marker([post.lat, post.lng], {
            icon: createMapMarkerIcon(post.type, post.isUrgent),
          }).bindPopup(`
            <div class="custom-popup">
              <strong>${post.title}</strong><br />
              <span>${post.type}</span>
            </div>
          `);

          this.postMarkersLayer.addLayer(marker);
        });
      });
  }

  private updateMapViewQueryParams(): void {
    if (!this.map) {
      return;
    }

    const center = this.map.getCenter();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        lat: center.lat.toFixed(6),
        lng: center.lng.toFixed(6),
        zoom: this.map.getZoom(),
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private getRadiusByZoom(zoom: number): number {
    if (zoom >= 16) {
      return 2;
    }

    if (zoom >= 15) {
      return 5;
    }

    if (zoom >= 13) {
      return 15;
    }

    if (zoom >= 11) {
      return 35;
    }

    if (zoom >= 9) {
      return 80;
    }

    return 250;
  }

  ngOnDestroy(): void {
    if (this.markerLoadTimeout) {
      clearTimeout(this.markerLoadTimeout);
    }

    this.map?.remove();
  }
}
