import {Injectable} from '@angular/core';
import {MapPost} from '../interface/MapPost';
import {MOCK_MAP_POSTS} from '../mocks/mapPost.mock';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  getMapPosts(): MapPost[] {
    return MOCK_MAP_POSTS;
  }

}
