import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';

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
export class MapOverlayComponent implements OnInit {
  @Input() isOpen = false;
  @Output() toggleOverlay = new EventEmitter<void>();

  posts: WritableSignal<MapPostMarker[]> = signal([]);

  constructor(private readonly postService: PostService) {}

  ngOnInit(): void {
    this.postService.mapPosts$.subscribe((posts) => {
      this.posts.set(posts);
    });
  }
}
