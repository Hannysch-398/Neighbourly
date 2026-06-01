import {PostMode, PostType} from '../models/post.model';

export interface MapPostMarker {
  id: number;
  type: PostType;
  title: string;
  lat: number;
  lng: number;
  postMode: PostMode
  isUrgent: boolean;
  createdAt: string;
  shortDescription?: string;
  // isSponsored: boolean;
}
