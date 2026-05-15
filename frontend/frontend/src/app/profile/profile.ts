import { Component, inject, signal } from '@angular/core';
import {Rating} from '../rating/rating';
import { ProfileService, ProfileData } from '../Service/profile.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [Rating, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  private profileService = inject(ProfileService);
  active = signal<boolean>(true);
  profile = signal<ProfileData | null>(null);
  //Platzhalter-Werte
  activePosts = false;
  archivedPosts = false;

  constructor() {
    this.profileService.getProfile().subscribe({
      next: (data) => this.profile.set(data),
      error: (err) => console.error('Fehler beim Laden des Profils', err),
    });
  }

}
