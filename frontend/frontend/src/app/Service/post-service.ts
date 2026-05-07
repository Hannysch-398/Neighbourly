import {Injectable} from '@angular/core';
import {MapPostMarker} from '../interface/MapPostMarker';
import {MOCK_MAP_POST_MARKERS} from '../mocks/mapPost.mock';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  getMapPosts(): MapPostMarker[] {
    return MOCK_MAP_POST_MARKERS;
  }

}
