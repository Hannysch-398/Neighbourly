import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';

import {PostResponse} from '../models/post.model';
import {PostsService} from '../services/posts.service';
import {PostCard} from '../components/post-card/post-card';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [PostCard, RouterLink],
  templateUrl: './posts-list.html',
  styleUrls: ['./posts-list.css'],
})
export class PostsListComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly posts = signal<PostResponse[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly hasPosts = computed(() => this.posts().length > 0);
  readonly urgentPosts = computed(() =>
    this.posts()
      .filter((post) => post.isUrgent)
      .slice(0, 3)
  );

  readonly regularPosts = computed(() => {
    const pinnedIds = new Set(this.urgentPosts().map((post) => post.id));

    return this.posts().filter((post) => !pinnedIds.has(post.id));
  });


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
        this.errorMessage.set('Die Beiträge konnten nicht geladen werden.');
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
