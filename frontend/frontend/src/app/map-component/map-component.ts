import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { PostService } from '../Service/post-service';
import { createMapMarkerIcon } from '../map-marker/map-marker';

@Component({
  selector: 'app-modern-map',
  standalone: true,
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  private map?: L.Map;

  private readonly defaultPosition: L.LatLngExpression = [53.088559, 8.79568]; // Bremen
  private readonly defaultZoom = 13;
  private readonly userZoom = 15;

  constructor(private readonly postService: PostService) {}

  ngAfterViewInit(): void {
    this.resolveInitialPosition().then(({ position, zoom }) => {
      this.initMap(position, zoom);
    });
  }

  private resolveInitialPosition(): Promise<{
    position: L.LatLngExpression;
    zoom: number;
  }> {
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

    this.addStartMarker(position);
    this.addPostMarkers();

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

  private addPostMarkers(): void {
    if (!this.map) {
      return;
    }

    this.postService.getMapPosts().forEach((post) => {
      L.marker([post.lat, post.lng], {
        icon: createMapMarkerIcon(post.type),
      })
        .addTo(this.map!)
        .bindPopup(`
          <div class="custom-popup">
            <strong>${post.title}</strong><br />
            <span>${post.type}</span>
          </div>
        `);
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
