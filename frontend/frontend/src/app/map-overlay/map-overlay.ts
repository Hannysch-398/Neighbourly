import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { SidebarEntry } from '../sidebar-entry/sidebar-entry';
import { MapPostMarker } from '../interface/MapPostMarker';
import { PostsService as PostService } from '../services/posts.service';

@Component({
  selector: 'app-map-overlay',
  standalone: true,
  templateUrl: './map-overlay.html',
  styleUrls: ['./map-overlay.css'],
  imports: [SidebarEntry],
})
export class MapOverlayComponent {
  public readonly postService = inject(PostService);

  @Input() isOpen = false;
  @Output() toggleOverlay = new EventEmitter<void>();

  readonly posts = this.postService.mapPosts;
  readonly selectedPost = this.postService.selectedMapPost;
  readonly state = this.postService.mapPostsState;
  readonly errorMessage = this.postService.mapPostsError;

  selectPost(post: MapPostMarker): void {
    if (!this.isOpen) {
      return;
    }

    this.postService.selectMapPost(post);
  }
}
