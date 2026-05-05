import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-modern-map',
  standalone: true,
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', {static: true}) mapElement!: ElementRef<HTMLDivElement>;

  private map?: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, {
      zoomControl: false,
      attributionControl: true,
    }).setView([53.089135, 8.794616

    ], 15);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution:
          '&copy; OpenStreetMap contributors &copy; CARTO',
      }
    ).addTo(this.map);

    L.control.zoom({
      position: 'bottomright',
    }).addTo(this.map);

// Testmarker inklusive Popup
    const modernIcon = L.divIcon({
      className: 'modern-marker',
      html: `
        <div class="marker-pin">
          <div class="marker-dot"></div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -38],
    });

    L.marker([53.089135, 8.794616], {
      icon: modernIcon,
    })
      .addTo(this.map)
      .bindPopup(`
        <div class="custom-popup">
          <strong>Bremen</strong>
        </div>
      `);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
