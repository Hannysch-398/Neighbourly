import { Component, Input, OnInit, signal } from '@angular/core';
import { AverageRatingResponse } from '../interface/AverageRatingResponse';
import { RatingResponse } from '../interface/RatingResponse';
import { RatingService } from '../services/rating-service';
import { ShowRatingComments } from '../show-rating-comments/show-rating-comments';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [ShowRatingComments],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating implements OnInit {
  @Input() userId!: number;

  ratingSignal = signal<AverageRatingResponse | null>(null);
  averageValue = signal(0);
  allRatings = signal<RatingResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  stars: number[] = [0, 0, 0, 0, 0];

  constructor(private ratingService: RatingService, private userService: UserService) {}




  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.ratingService.getAverageRating(this.userId).subscribe({
      next: res => {
        this.ratingSignal.set(res);
        this.averageValue.set(res.average);
        this.stars = this.createRatingArray(res.average);
      },
      error: () => {
        this.errorMessage.set('Bewertungen konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });

    this.ratingService.getAllRatingsForUser(this.userId).subscribe({
      next: res => {
        this.allRatings.set(res);
      },
      error: () => {
        this.errorMessage.set('Bewertungen konnten nicht geladen werden.');
      },
    });
  }

  createRatingArray(average?: number): number[] {
    const value = average ?? this.ratingSignal()?.average;

    if (value === null || value === undefined) {
      return [0, 0, 0, 0, 0];
    }

    const roundedRating = Math.floor(value);
    const ratingArray: number[] = [];

    for (let i = 0; i < 5; i++) {
      ratingArray.push(i < roundedRating ? 1 : 0);
    }

    return ratingArray;
  }

  reload(): void {
    this.loadRatings();
  }
}
