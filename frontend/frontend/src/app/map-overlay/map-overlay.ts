import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-map-overlay',
  standalone: true,
  templateUrl: './map-overlay.html',
  styleUrls: ['./map-overlay.css'],
})
export class MapOverlayComponent {
  @Input() isOpen = false;
  @Output() toggleOverlay = new EventEmitter<void>();
}
