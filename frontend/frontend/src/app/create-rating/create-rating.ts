import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RatingService} from '../services/rating-service';
import {RatingRequest} from '../interface/RatingRequest';
import {UserService} from '../services/user-service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-rating',
  standalone: true,
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
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  raterUserId = this.userService.getUserIdSignal();

  ratedUserId = Number(this.route.snapshot.paramMap.get('id'));

  constructor(private ratingService: RatingService) {
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitRatingForm(): void {

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const raterId = this.raterUserId();

    if (raterId === null) {
      this.isSubmitting = false;
      this.errorMessage = 'Bitte melde dich an.';
      return;
    }

    const ratingRequest: RatingRequest = {
      rating: this.selectedRating,
      comment: this.comment,
    };

    this.ratingService.postRating(this.ratedUserId, ratingRequest).subscribe({
      next: () => {

        this.isSubmitting = false;

        this.successMessage =
          'Bewertung erfolgreich gespeichert.';

        this.comment = '';
        this.selectedRating = 0;

        this.ratingCreated.emit();
      },

      error: (error) => {

        this.isSubmitting = false;

        const message = error?.error?.message ?? '';

        if (message.includes('already rated')) {
          this.errorMessage =
            'Du hast diesen Beitrag bereits bewertet.';
          return;
        }

        if (error.status === 401) {
          this.errorMessage =
            'Bitte melde dich an.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage =
            'Du bist nicht berechtigt diese Bewertung abzugeben.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage =
            'Ungültige Bewertungsdaten.';
          return;
        }

        this.errorMessage =
          'Bewertung konnte nicht gespeichert werden.';
      },
    });
  }
}
