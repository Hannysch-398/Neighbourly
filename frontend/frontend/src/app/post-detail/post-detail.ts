import {DatePipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit, computed, inject, signal, effect} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subject, catchError, map, of, switchMap, takeUntil, tap} from 'rxjs';

import {LocationDto, PostDetailResponse} from '../models/post-detail.model';
import {PostsService} from '../services/posts.service';
import {AuthService} from '../services/auth.service';
import {ChatService} from '../services/chat.service';
import {Conversation} from '../models/conversation.model';

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
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();
  selectedImage = signal<any>(null);
  protected readonly post = signal<PostDetailResponse | null>(null);
  protected readonly postId = signal<number | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isDeleting = signal(false);
  protected readonly isConfirmingDelete = signal(false);
  protected readonly errorMessage = signal('');
  private readonly chatService = inject(ChatService);

  protected readonly isStartingConversation = signal(false);
  protected readonly conversationError = signal('');
  protected readonly userId = computed(() => this.post()?.userId ?? null);

  protected readonly typeLabel = computed(() => {
    const type = this.post()?.type;

    if (!type) {
      return 'Beitrag';
    }

    return this.formatLabel(type);
  });
  protected readonly typeSpecificDetails = computed<DetailEntry[]>(() => {
    const post = this.post();

    if (!post || typeof post.details !== 'object' || post.details === null || Array.isArray(post.details)) {
      return [];
    }

    const details = post.details as Record<string, unknown>;

    switch (post.type) {
      case 'EVENT':
        return this.buildDetails(details, [
          ['Start', 'startDate'],
          ['Ende', 'endDate'],
          ['Ort', 'venue'],
        ]);

      case 'SKILL':
        return this.buildDetails(details, [
          ['Skill', 'skillName'],
          ['Tags', 'skillTags'],
          ['Verfügbarkeit', 'availabilityNote'],
          ['Erfahrungslevel', 'experienceLevel'],
        ]);

      case 'PRODUCT':
        return this.buildDetails(details, [
          ['Produktname', 'productName'],
          ['Preis', 'price'],
          ['Währung', 'currency'],
          ['Zustand', 'condition'],
        ]);

      case 'HOUSING':
        return this.buildDetails(details, [
          ['Wohnfläche', 'area'],
          ['Zimmer', 'rooms'],
          ['Miete', 'rent'],
          ['Verfügbar ab', 'availableFrom'],
        ]);

      default:
        return [];
    }
  });
  protected readonly isOwner = computed(() => {
    const post = this.post();

    if (!post) {
      return false;
    }

    if (typeof post.isOwner === 'boolean') {
      return post.isOwner;
    }

    const currentUserEmail = this.authService.getCurrentUserEmail()?.toLowerCase();
    const ownerEmail = this.readPostString([
      'author.email',
      'user.email',
      'owner.email',
      'email',
      'userEmail',
    ]).toLowerCase();

    return !!currentUserEmail && !!ownerEmail && currentUserEmail === ownerEmail;
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => this.parsePostId(params.get('id'))),
        tap((id) => {
          this.postId.set(id);
          this.post.set(null);
          this.errorMessage.set('');
          this.isLoading.set(true);
        }),
        switchMap((id) => {
          if (id === null) {
            return of<PostDetailState>({
              post: null,
              errorMessage: 'Die angegebene Post-ID ist ungültig.',
            });
          }

          return this.postService.getPostById(id).pipe(
            map((post) => ({
              post,
              errorMessage: '',
            })),
            catchError((error) =>
              of<PostDetailState>({
                post: null,
                errorMessage: this.resolveErrorMessage(error),
              }),
            ),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (state) => {
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

    const parts = [
      location.address,
      location.postalCode,
      location.city,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : 'Standort ohne Ortsnamen';
  }

  //Signals für User noch anpassen
  protected userEmail(): string {
    return (
      this.readPostString(['author.email', 'user.email', 'owner.email', 'email', 'userEmail']) ||
      'Keine E-Mail hinterlegt'
    );
  }

  protected userName(): string {
    return (
      this.readPostString([
        'author.username',
        'user.username',
        'owner.username',
        'username',
        'name',
      ]) || 'Nutzer'
    );
  }

  protected userInitials(): string {
    const value = this.userName() !== 'Nutzer' ? this.userName() : this.userEmail();

    return (
      value
        .split(/[.\s@_-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || '?'
    );
  }

  protected paymentText(): string {
    const details = this.post()?.details;

    if (typeof details === 'object' && details !== null && !Array.isArray(details)) {
      const values = details as Record<string, unknown>;
      const price = values['price'];
      const currency = values['currency'];
      const payment = values['payment'] ?? values['paymentType'] ?? values['compensation'];

      if (price !== null && price !== undefined && price !== '') {
        return `${price}${currency ? ` ${currency}` : ''}`;
      }

      if (payment !== null && payment !== undefined && payment !== '') {
        return String(payment);
      }
    }

    return 'VB';
  }

  protected editPost(): void {
    const id = this.postId();

    if (id === null) {
      return;
    }

    void this.router.navigate(['/posts', id, 'edit']);
  }

  protected deletePost(): void {
    this.isConfirmingDelete.set(true);
  }

  protected cancelDelete(): void {
    if (this.isDeleting()) {
      return;
    }

    this.isConfirmingDelete.set(false);
  }

  protected confirmDelete(): void {
    const id = this.postId();

    if (id === null || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.isConfirmingDelete.set(false);
    this.errorMessage.set('');

    this.postService
      .deletePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          void this.router.navigate(['/posts'], {
            queryParams: {
              deleted: 'true',
            },
          });
        },
        error: (error) => {
          this.errorMessage.set(this.resolveDeleteErrorMessage(error));
          this.isDeleting.set(false);
        },
      });
  }

  private buildDetails(
    details: Record<string, unknown>,
    fields: [string, string][]
  ): DetailEntry[] {
    return fields
      .map(([label, key]) => ({
        label,
        value: this.formatDetailValue(details[key]),
      }))
      .filter(entry => entry.value !== '');
  }

  private formatDetailValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'boolean') {
      return value ? 'Ja' : 'Nein';
    }

    return String(value);
  }

  private parsePostId(value: string | null): number | null {
    const id = Number(value);

    return Number.isInteger(id) && id > 0 ? id : null;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        return 'Der Beitrag wurde nicht gefunden.';
      }

      if (error.status === 403) {
        return 'Du hast keinen Zugriff auf diesen Beitrag.';
      }
    }

    return 'Der Beitrag konnte nicht geladen werden.';
  }

  private resolveDeleteErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 403) {
      return 'Du darfst diesen Beitrag nicht löschen.';
    }

    return 'Der Beitrag könnte nicht gelöscht werden.';
    if (!(error instanceof HttpErrorResponse)) {
      return 'Der Beitrag konnte nicht geloescht werden. Bitte versuche es erneut.';
    }

    if (error.status === 0) {
      return 'Das Backend ist nicht erreichbar. Bitte pruefe deine Verbindung und versuche es erneut.';
    }

    if (error.status === 401) {
      return 'Bitte melde dich erneut an, um den Beitrag zu loeschen.';
    }

    if (error.status === 403) {
      return 'Du darfst diesen Beitrag nicht loeschen.';
    }

    if (error.status === 404) {
      return 'Der Beitrag wurde bereits geloescht oder nicht gefunden.';
    }

    return this.extractBackendErrorMessage(error) || 'Der Beitrag konnte nicht geloescht werden. Bitte versuche es erneut.';
  }

  private extractBackendErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }

    const apiError = error.error as Partial<{ message: string; errors: Record<string, string> }> | null;
    const firstFieldError = apiError?.errors ? Object.values(apiError.errors)[0] : undefined;

    return firstFieldError || apiError?.message || '';
  }

  private formatLabel(value: string): string {
    const normalized = value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .toLowerCase();

    return normalized.replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
  }

  private readPostString(paths: string[]): string {
    const post = this.post() as unknown as Record<string, unknown> | null;

    if (!post) {
      return '';
    }

    for (const path of paths) {
      const value = this.readPath(post, path);

      if (typeof value === 'string' && value.trim() !== '') {
        return value;
      }
    }

    return '';
  }

  private readPath(source: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (typeof current !== 'object' || current === null) {
        return undefined;
      }

      return (current as Record<string, unknown>)[key];
    }, source);
  }

  constructor() {
    effect(() => {
      const images = this.post()?.images;
      if (images && images.length > 0 && !this.selectedImage()) {
        this.selectedImage.set(images[0]);
      }
    });
  }

  selectImage(image: any): void {
    this.selectedImage.set(image);
  }

  protected startConversation(): void {
    const id = this.postId();

    if (!id || this.isStartingConversation()) {
      return;
    }

    this.isStartingConversation.set(true);
    this.conversationError.set('');

    this.chatService.createConversation(id).subscribe({
      next: (conversation: Conversation) => {
        this.isStartingConversation.set(false);
        void this.router.navigate(['/chat'], {
          queryParams: {
            conversationId: conversation.id,
          },
        });
      },
      error: () => {
        this.conversationError.set('Unterhaltung könnte nicht gestartet werden.');
        this.isStartingConversation.set(false);
      },
    });
  }
}
