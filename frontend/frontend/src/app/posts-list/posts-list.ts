import { DatePipe } from '@angular/common';
import {Component, OnInit, inject, signal, computed} from '@angular/core';

import { PostResponse } from '../models/post.model';
import { PostsService } from '../Service/posts.service';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.css',
})
export class PostsListComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly posts = signal<PostResponse[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly hasPosts = computed(() => this.posts().length > 0);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Die Beitrage konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }

  getPostTypeLabel(type: PostResponse['type']): string {
    const labels: Record<PostResponse['type'], string> = {
      EVENT: 'Event',
      SKILL: 'Skill',
      PRODUCT: 'Produkt',
      HOUSING: 'Wohnen',
    };

    return labels[type] ?? type;
  }

  getPostModeLabel(postMode: PostResponse['postMode']): string {
    const labels: Record<string, string> = {
      OFFER: 'Angebot',
      REQUEST: 'Gesuch',
    };

    return labels[postMode] ?? postMode;
  }

  trackPostById(_: number, post: PostResponse): number {
    return post.id;
  }
}
