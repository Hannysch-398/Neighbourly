import {Component, EventEmitter, inject, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../services/rating-service';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingRequest } from '../interface/RatingRequest';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-create-rating',
  imports: [FormsModule],
  templateUrl: './create-rating.html',
  styleUrl: './create-rating.css',
})
export class CreateRating {
  @Output() ratingCreated = new EventEmitter<void>();
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  stars: number[] = [0, 0, 0, 0, 0];
  selectedRating = 0;
  comment = '';

  raterUserId = this.userService.getUserIdSignal();

  ratedUserId = Number(this.route.snapshot.paramMap.get('id'));

  constructor(private ratingService: RatingService) {}

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitRatingForm(): void {
    const raterId = this.raterUserId();
    console.log(raterId, this.ratedUserId);

    if (raterId === null) {
      console.error('Kein eingeloggter Benutzer');
      return;
    }

    const ratingRequest: RatingRequest = {
      raterUserId: raterId,
      ratedUserId: this.ratedUserId,
      rating: this.selectedRating,
      comment: this.comment,
      creationDate: new Date().toISOString(),
    };
    this.ratingService.postRating(this.ratedUserId, ratingRequest).subscribe({
      next: () => {
        this.comment = '';
        this.selectedRating = 0;
        this.ratingCreated.emit();
      },
      error: (error) => {
        console.error('Bewertung konnte nicht gespeichert werden', error);
      },
    });
  }
}
