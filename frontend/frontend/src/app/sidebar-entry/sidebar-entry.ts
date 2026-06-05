import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MapPostMarker } from '../interface/MapPostMarker';
import { PostMode, PostType } from '../models/post.model';

const TYPE_ICONS: Record<PostType, string> = {
  EVENT: '📅',
  SKILL: '🛠️',
  PRODUCT: '📦',
  HOUSING: '🏠',
};

const MODE_ICONS: Record<PostMode, string> = {
  REQUEST: '❓',
  OFFER: '❗',
};

@Component({
  selector: 'app-sidebar-entry',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar-entry.html',
  styleUrls: ['./sidebar-entry.css'],
})
export class SidebarEntry {
  @Input({ required: true })
  post!: MapPostMarker;

  @Input()
  selected = false;

  @Output()
  selectPost = new EventEmitter<MapPostMarker>();

  get typeIcon(): string {
    return this.post.type ? TYPE_ICONS[this.post.type] : '';
  }

  get modeIcon(): string {
    return this.post.postMode ? MODE_ICONS[this.post.postMode] : '';
  }

  formatDate(value: string | Date): string {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  }

  onSelect(): void {
    this.selectPost.emit(this.post);
  }
}
