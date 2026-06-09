import {Component, inject, signal} from '@angular/core';
import {Rating} from '../rating/rating';
import {ProfileService, ProfileData} from '../services/profile.service';
import {Router, RouterLink} from '@angular/router';
import {PostCard} from '../components/post-card/post-card';
import {PostsService} from '../services/posts.service';
import {PostResponse} from '../models/post.model';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-profile',
  imports: [Rating, RouterLink, PostCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private postsService = inject(PostsService);
  private userService = inject(UserService);

  active = signal<boolean>(true);
  profile = signal<ProfileData | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  posts = signal<PostResponse[]>([]);

  activePosts = true;
  archivedPosts = false;

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);

        if (data.id != null) {
          this.loadUserPosts(data.id);
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.profile.set(null);
        this.posts.set([]);
        this.isLoading.set(false);

        if (err.status === 401) {
          this.errorMessage.set('Bitte melde dich an, um dein Profil zu sehen.');
          this.router.navigate(['/auth']);
          return;
        }

        this.errorMessage.set('Profil konnte nicht geladen werden. Bitte versuche es später erneut.');
      },
    });
  }

  private loadUserPosts(userId: number): void {
    this.postsService.getPostsByUserId(userId).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.activePosts = posts.length > 0;
        this.isLoading.set(false);
      },
      error: () => {
        this.posts.set([]);
        this.activePosts = false;
        this.isLoading.set(false);
      },
    });
  }
}
