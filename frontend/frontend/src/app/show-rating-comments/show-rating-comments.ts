import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { RatingResponse } from '../interface/RatingResponse';

@Component({
  selector: 'app-show-rating-comments',
  standalone: true,
  imports: [],
  templateUrl: './show-rating-comments.html',
  styleUrl: './show-rating-comments.css',
})
export class ShowRatingComments implements OnChanges {
  @Input() ratings: RatingResponse[] = [];

  showMore = signal(false);

  currentPage = 0;
  pageSize = 5;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ratings']) {
      this.currentPage = 0;
    }
  }

  toggleShowMore(): void {
    this.showMore.set(!this.showMore());
    this.currentPage = 0;
  }

  get paginatedRatings(): RatingResponse[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    return this.ratings.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.ratings.length / this.pageSize);
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  createRatingArrayForSingleRating(rating: number): number[] {
    const roundedRating = Math.floor(rating);
    const ratingArray: number[] = [];

    for (let i = 0; i < 5; i++) {
      ratingArray.push(i < roundedRating ? 1 : 0);
    }

    return ratingArray;
  }

  formatDate(date: string): string {
    const splitDateTime = date.split('T');
    const justDate = splitDateTime[0].split('-');

    const formattedDate = [
      justDate[2],
      justDate[1],
      justDate[0],
    ].join('.');

    const formattedTime = splitDateTime[1]
      .split(':')
      .slice(0, 2)
      .join(':');

    return `${formattedDate}, ${formattedTime} Uhr`;
  }
}
