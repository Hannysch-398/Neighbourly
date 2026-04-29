import { Component, inject, signal } from '@angular/core';
import {Rating} from '../rating/rating';
import { AccountDeleteArea } from '../account-delete-area/account-delete-area';
import { ProfileService, ProfileData } from '../Service/profile.service';

@Component({
  selector: 'app-profile',
  imports: [AccountDeleteArea, Rating],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private profileService = inject(ProfileService);

  profile = signal<ProfileData | null>(null);

  constructor() {
    this.profileService.getProfile().subscribe({
      next: (data) => this.profile.set(data),
      error: (err) => console.error('Fehler beim Laden des Profils', err),
    });
  }
}
