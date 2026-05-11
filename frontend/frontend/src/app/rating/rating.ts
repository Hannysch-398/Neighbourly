import { Component, Input, OnInit, signal } from '@angular/core';
import { AverageRatingResponse } from '../interface/AverageRatingResponse';
import { RatingResponse } from '../interface/RatingResponse';
import { RatingService } from '../Service/rating-service';
import { ShowRatingComments } from '../show-rating-comments/show-rating-comments';

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

  stars: number[] = [0, 0, 0, 0, 0];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.ratingService.getAverageRating(this.userId).subscribe(res => {
      this.ratingSignal.set(res);
      this.averageValue.set(res.average);
      this.stars = this.createRatingArray(res.average);
    });

    this.ratingService.getAllRatingsForUser(this.userId).subscribe(res => {
      this.allRatings.set(res);
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
}
