import * as L from 'leaflet';
import { PostMode, PostType } from '../models/post.model';
import { MapPostMarker } from '../interface/MapPostMarker';
import {MARKER_ICONS, MODE_ICONS} from "../models/post.model"


export function createPostMarker(post: MapPostMarker): L.Marker {
  return L.marker([post.lat, post.lng], {
    icon: createMapMarkerIcon(post.type, post.isUrgent),
  }).bindPopup(createPostPopup(post));
}

export function createStartMarker(position: L.LatLngExpression): L.Marker {
  return L.marker(position, {
    icon: createMapMarkerIcon(),
  }).bindPopup(createStartPopup());
}

export function createMapMarkerIcon(type?: PostType, isUrgent = false): L.DivIcon {
  const icon = type ? MARKER_ICONS[type] : '';

  return L.divIcon({
    className: [
      'modern-marker',
      type ? `marker-${type.toLowerCase()}` : 'marker-default',
      isUrgent ? 'marker-urgent' : '',
    ]
      .filter(Boolean)
      .join(' '),
    html: `
      <div class="marker-pin">
        <div class="marker-dot">
          ${icon ? `<span class="marker-icon">${icon}</span>` : ''}
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
  });
}

function createPostPopup(post: MapPostMarker): string {
  const typeIcon = post.type ? MARKER_ICONS[post.type] : '';
  const modeIcon = post.postMode ? MODE_ICONS[post.postMode] : '';
  const urgentClass = post.isUrgent ? 'custom-popup--urgent' : '';

  return `
    <div class="custom-popup ${urgentClass}">
      ${post.isUrgent ? '<div class="custom-popup__urgent">Dringend</div>' : ''}

      <div class="custom-popup__title-container">
        <span class="custom-popup__mode">${modeIcon}</span>

        <strong class="custom-popup__title">
          ${post.title}
        </strong>

        <span class="custom-popup__type-icon">${typeIcon}</span>
      </div>

      ${
        post.createdAt
          ? `<span class="custom-popup__date">Erstellt am: ${formatDate(post.createdAt)}</span>`
          : ''
      }

      ${post.shortDescription ? `<p class="custom-popup__text">${post.shortDescription}</p>` : ''}

      <a href="posts/${post.id}" class="custom-popup__link">
        <button class="custom-popup__button" type="button">
          Post ansehen
        </button>
      </a>
    </div>
  `;
}

function createStartPopup(): string {
  return `
    <div class="custom-popup">
      <strong class="custom-popup__title">Startposition</strong>
    </div>
  `;
}

function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
