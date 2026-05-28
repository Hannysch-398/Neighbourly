import {Component, inject, signal} from '@angular/core';
import {Rating} from '../rating/rating';
import {ProfileService, ProfileData} from '../service/profile.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [Rating, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  active = signal<boolean>(true);
  profile = signal<ProfileData | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  activePosts = false;
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
        this.isLoading.set(false);
      },
      error: (err) => {
        this.profile.set(null);
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
}
