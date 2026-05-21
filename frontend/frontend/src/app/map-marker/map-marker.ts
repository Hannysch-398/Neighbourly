import * as L from 'leaflet';
import {MapPostMarkerType} from '../interface/MapPostMarker';

function getMarkerIcon(type?: MapPostMarkerType): string {
  switch (type) {
    case 'EVENT':
      return '📅';
    case 'SKILL':
      return '🛠️';
    case 'PRODUCT':
      return '📦';
    case 'HOUSING':
      return '🏠';
    default:
      return '';
  }
}

export function createMapMarkerIcon(type?: MapPostMarkerType, isUrgent = false): L.DivIcon {
  const icon = getMarkerIcon(type);

  return L.divIcon({
    className: `modern-marker ${type ? `marker-${type.toLowerCase()}` : 'marker-default'}${isUrgent ? 'marker-urgent' : ''}`,
    html: `
      <div class="marker-pin">
        <div class="marker-dot">
          ${
      icon
        ? `<span class="marker-icon">${icon}</span>`
        : ''
    }
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
  });
}
