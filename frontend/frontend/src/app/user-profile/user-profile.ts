import { Component, OnInit, computed, inject, signal, ViewChild, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Rating } from '../rating/rating';
import { CreateRating } from '../create-rating/create-rating';
import { UserService, ProfileData } from '../services/user-service';
import { PostsService } from '../services/posts.service';
import { PostResponse } from '../models/post.model';
import { PostCard } from '../components/post-card/post-card';

@Component({
  selector: 'app-user-profile',
  imports: [
    RouterLink,
    DatePipe,
    Rating,
    CreateRating,
    PostCard
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private postsService = inject(PostsService);
  private router = inject(Router);

  userId = Number(this.route.snapshot.paramMap.get('id'));

  ownUserId = this.userService.getUserIdSignal();

  profile = signal<ProfileData | null>(null);
  posts = signal<PostResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  @ViewChild(Rating) ratingComponent?: Rating;

  userInitials = computed(() => {
    const name = this.profile()?.username;

    if (!name) {
      return '?';
    }

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  });

  constructor() {
    effect(() => {
      const currentUserId = this.ownUserId();

      if (currentUserId === null) {
        return;
      }

      if (currentUserId === this.userId) {
        this.router.navigate(['/profile']);
      }
    });
  }

  ngOnInit(): void {
    if (!this.userId || Number.isNaN(this.userId)) {
      this.errorMessage.set('Ungültige User-ID.');
      this.isLoading.set(false);
      return;
    }

    this.loadUserProfile();
    this.loadUserPosts();
  }

  refreshRating(): void {
    this.ratingComponent?.reload();
  }

  private loadUserProfile(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: profile => {
        this.profile.set(profile);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Profil konnte nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }

  private loadUserPosts(): void {
    this.postsService.getPostsByUserId(this.userId).subscribe({
      next: posts => {
        this.posts.set(posts);
      },
      error: () => {
        this.posts.set([]);
      },
    });
  }
}
