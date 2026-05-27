export type MapPostMarkerType = 'EVENT' | 'SKILL' | 'PRODUCT' | 'HOUSING'| '';

export interface MapPostMarker {
  id: number;
  type: MapPostMarkerType;
  title: string;
  lat: number;
  lng: number;
  shortDescription?: string;
  isUrgent: boolean;
  isSponsored: boolean;
  createdAt: string;
}
