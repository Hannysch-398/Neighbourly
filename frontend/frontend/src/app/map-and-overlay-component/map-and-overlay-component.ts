import { Component } from '@angular/core';
import {MapComponent} from '../map-component/map-component';
import {MapOverlayComponent} from '../map-overlay/map-overlay';

@Component({
  selector: 'app-map-and-overlay-component',
  imports: [
    MapComponent,
    MapOverlayComponent
  ],
  templateUrl: './map-and-overlay-component.html',
  styleUrl: './map-and-overlay-component.css',
})
export class MapAndOverlayComponent {
  isOverlayOpen = false;

  toggleOverlay(): void {
    this.isOverlayOpen = !this.isOverlayOpen;
  }

}
