import { Component } from '@angular/core';
import { MARKER_ICONS, MODE_ICONS } from '../models/post.model';
import { PostMode, PostType } from '../models/post.model';

type MarkerLegendItem = {
  type: PostType;
  label: string;
  icon: string;
};

type ModeLegendItem = {
  mode: PostMode;
  label: string;
  icon: string;
};

@Component({
  selector: 'app-map-legend',
  standalone: true,
  templateUrl: './map-legend.html',
  styleUrls: ['./map-legend.css'],
})
export class MapLegendComponent {
  isOpen = false;

  protected readonly markerLegend: MarkerLegendItem[] = [
    {
      type: 'EVENT',
      label: 'Event',
      icon: MARKER_ICONS.EVENT,
    },
    {
      type: 'SKILL',
      label: 'Skill',
      icon: MARKER_ICONS.SKILL,
    },
    {
      type: 'PRODUCT',
      label: 'Produkt',
      icon: MARKER_ICONS.PRODUCT,
    },
    {
      type: 'HOUSING',
      label: 'Wohnraum',
      icon: MARKER_ICONS.HOUSING,
    },
  ];

  protected readonly modeLegend: ModeLegendItem[] = [
    {
      mode: 'REQUEST',
      label: 'Gesuch',
      icon: MODE_ICONS.REQUEST,
    },
    {
      mode: 'OFFER',
      label: 'Angebot',
      icon: MODE_ICONS.OFFER,
    },
  ];

  toggleLegend(): void {
    this.isOpen = !this.isOpen;
  }
}
