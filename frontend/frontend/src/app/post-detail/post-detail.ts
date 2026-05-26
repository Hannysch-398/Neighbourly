import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, catchError, map, of, switchMap, takeUntil, tap } from 'rxjs';

import { LocationDto, PostDetailResponse } from '../models/post-detail.model';
import { PostsService } from '../Service/posts.service';

interface DetailEntry {
  label: string;
  value: string;
}

interface PostDetailState {
  post: PostDetailResponse | null;
  errorMessage: string;
}

@Component({
  selector: 'app-post-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostsService);
  private readonly destroy$ = new Subject<void>();

  protected readonly post = signal<PostDetailResponse | null>(null);
  protected readonly postId = signal<number | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly typeLabel = computed(() => {
    const type = this.post()?.type;

    if (!type) {
      return 'Beitrag';
    }

    return this.formatLabel(type);
  });

  protected readonly detailEntries = computed<DetailEntry[]>(() => {
    const details = this.post()?.details;

    if (details === null || details === undefined || details === '') {
      return [];
    }

    if (typeof details !== 'object' || Array.isArray(details)) {
      return [{
        label: 'Details',
        value: this.formatDetailValue(details),
      }];
    }

    return Object.entries(details as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({
        label: this.formatLabel(key),
        value: this.formatDetailValue(value),
      }));
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => this.parsePostId(params.get('id'))),
        tap(id => {
          this.postId.set(id);
          this.post.set(null);
          this.errorMessage.set('');
          this.isLoading.set(true);
        }),
        switchMap(id => {
          if (id === null) {
            return of<PostDetailState>({
              post: null,
              errorMessage: 'Die angegebene Post-ID ist ungültig.',
            });
          }

          return this.postService.getPostById(id).pipe(
            map(post => ({
              post,
              errorMessage: '',
            })),
            catchError(error => of<PostDetailState>({
              post: null,
              errorMessage: this.resolveErrorMessage(error),
            })),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: state => {
          this.post.set(state.post);
          this.errorMessage.set(state.errorMessage);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected locationText(location: LocationDto | null | undefined): string {
    if (!location) {
      return 'Noch kein Standort hinterlegt';
    }

    const parts = [location.district, location.city].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Standort ohne Ortsnamen';
  }

  protected coordinatesText(location: LocationDto | null | undefined): string {
    if (
      location?.latitude === null ||
      location?.latitude === undefined ||
      location.longitude === null ||
      location.longitude === undefined
    ) {
      return 'Keine Koordinaten verfügbar';
    }

    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }

  private parsePostId(value: string | null): number | null {
    const id = Number(value);

    return Number.isInteger(id) && id > 0 ? id : null;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return 'Der Beitrag wurde nicht gefunden.';
    }

    return 'Der Beitrag konnte nicht geladen werden.';
  }

  private formatLabel(value: string): string {
    const normalized = value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .toLowerCase();

    return normalized.replace(/^\w|\s\w/g, letter => letter.toUpperCase());
  }

  private formatDetailValue(value: unknown): string {
    if (Array.isArray(value)) {
      return value.map(item => this.formatDetailValue(item)).join(', ');
    }

    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  }
}
