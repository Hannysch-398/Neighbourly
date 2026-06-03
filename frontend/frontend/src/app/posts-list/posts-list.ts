import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PostResponse} from '../models/post.model';
import {PostsService} from '../services/posts.service';
import {PostCard} from '../components/post-card/post-card';
import { ActivatedRoute } from '@angular/router';
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

  readonly posts = signal<PostResponse[]>([]);
  readonly state = signal<ListState>('loading');
  readonly errorMessage = signal('');
  private readonly route = inject(ActivatedRoute);
  readonly isListView = signal(false);


  ngOnInit(): void {
    this.isListView.set(this.isListViewFromQuery());
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

  private isListViewFromQuery(): boolean {
    return this.route.snapshot.queryParamMap.get('view') === 'list';
  }

}
