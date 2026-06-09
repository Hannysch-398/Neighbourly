import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PostResponse} from '../models/post.model';
import {PostsService} from '../services/posts.service';
import {PostCard} from '../components/post-card/post-card';
type ListState = 'loading' | 'empty' | 'error' | 'ready';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [PostCard, RouterLink],
  templateUrl: './posts-list.html',
  styleUrls: ['./posts-list.css'],
})
export class PostsListComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly posts = signal<PostResponse[]>([]);
  readonly state = signal<ListState>('loading');
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
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
    this.showDeleteSuccessFromQueryParam();
    this.loadPosts();
  }

  loadPosts(): void {
    this.state.set('loading');
    this.errorMessage.set('');
    this.posts.set([]);

    this.postsService.getPosts().subscribe({
      next: (posts) => {
        if (!Array.isArray(posts)) {
          this.showError('Die Beitragsliste konnte nicht verarbeitet werden.');
          return;
        }

        this.posts.set(posts);
        this.state.set(posts.length === 0 ? 'empty' : 'ready');
      },
      error: () => {
        this.showError('Die Beiträge konnten nicht geladen werden. Bitte versuche es erneut.');
      },
    });
  }

  private showError(message: string): void {
    this.posts.set([]);
    this.errorMessage.set(message);
    this.state.set('error');
  }

  private showDeleteSuccessFromQueryParam(): void {
    if (this.route.snapshot.queryParamMap.get('deleted') !== 'true') {
      return;
    }

    this.successMessage.set('Beitrag wurde erfolgreich geloescht.');

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        deleted: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

}
