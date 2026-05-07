import { MapPostMarker } from '../interface/MapPostMarker';

export const MOCK_MAP_POST_MARKERS: MapPostMarker[] = [
  {
    id: 1,
    type: 'EVENT',
    title: 'Nachbarschaftstreffen',
    lat: 52.52,
    lng: 13.405,
    isUrgent: true,
    isSponsored: false,
    createdAt: '2026-05-07T10:00:00Z',
  },
  {
    id: 2,
    type: 'SKILL',
    title: 'Biete Fahrradreparatur',
    lat: 52.518,
    lng: 13.407,
    isUrgent: false,
    isSponsored: true,
    createdAt: '2026-05-07T10:15:00Z',
  },
  {
    id: 3,
    type: 'PRODUCT',
    title: 'Werkzeug zu verschenken',
    lat: 52.521,
    lng: 13.402,
    isUrgent: false,
    isSponsored: false,
    createdAt: '2026-05-07T10:30:00Z',
  },
  {
    id: 4,
    type: 'HOUSING',
    title: 'Zimmer kurzfristig gesucht',
    lat: 52.519,
    lng: 13.41,
    isUrgent: true,
    isSponsored: false,
    createdAt: '2026-05-07T10:45:00Z',
  },
];
