import { Component, OnInit, signal } from '@angular/core';
import { AverageRatingResponse } from '../interface/AverageRatingResponse';
import { RatingService } from '../service/rating-service';
import { RatingResponse } from '../interface/RatingResponse';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating implements OnInit {
  ratingSignal = signal<AverageRatingResponse | null>(null);
  averageValue = signal(0);
  showMore = signal(false);
  allRatings = signal<RatingResponse[]>([]);

  stars: number[] = [0, 0, 0, 0, 0];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.ratingService.getAverageRating(2).subscribe(res => {
      this.ratingSignal.set(res);
      this.averageValue.set(res.average);
      this.stars = this.createRatingArray(res.average);
    });

    this.ratingService.getAllRatingsForUser(2).subscribe(res => {
      this.allRatings.set(res);
    });
  }

  toggleShowMore(): void {
    this.showMore.set(!this.showMore());
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

  createRatingArrayForSingleRating(rating: number): number[] {
    const roundedRating = Math.floor(rating);
    const ratingArray: number[] = [];

    for (let i = 0; i < 5; i++) {
      ratingArray.push(i < roundedRating ? 1 : 0);
    }

    return ratingArray;
  }
}
