import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreatePostLocationDto,
  CreatePostRequest,
  PostMode,
  PostResponse,
  PostType,
} from '../models/post.model';
import { PostsService } from '../services/posts.service';
import { GeoService } from '../services/geo.service';
import { UpdatePostRequest } from '../models/update-post-request.model';
import { PostDetailResponse } from '../models/post-detail.model';
import { PostImage } from '../models/post-image.model';

type PostTypeOption = {
  value: PostType;
  label: string;
};

type PostModeOption = {
  value: PostMode;
  label: string;
};

type PostBasicFormModel = {
  title: string;
  description: string;
  type: PostType;
  postMode: PostMode;
  isUrgent: boolean;
  urgentUntil: string;
  hasLocation: boolean;
  city: string;
  address: string;
  eventStartDate: string;
  eventEndDate: string;
  eventVenue: string;
  experienceLevel: string;
  productName: string;
  price: string;
  housingType: string;
  rent: string;
  showLargeMap: boolean;
  skillTags: string;
  availabilityNote: string;
  currency: string;
  condition: string;
  rooms: string;
  availableFrom: string;
  postalCode: string;
  resolvedLocation: CreatePostLocationDto | null;
};

type ImageUploadStatus = 'selected' | 'uploading' | 'uploaded' | 'error';

type SelectedPostImage = {
  id: number;
  file: File;
  previewUrl: string;
  progress: number;
  status: ImageUploadStatus;
  error: string | null;
  uploadedImage: PostImage | null;
};

const initialData: PostBasicFormModel = {
  title: '',
  description: '',
  type: 'SKILL',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: '',
  hasLocation: true,
  city: '',
  address: '',
  eventStartDate: '',
  eventEndDate: '',
  eventVenue: '',
  experienceLevel: '',
  productName: '',
  price: '',
  housingType: '',
  rent: '',
  showLargeMap: false,
  skillTags: '',
  availabilityNote: '',
  currency: 'EUR',
  condition: '',
  rooms: '',
  availableFrom: '',
  postalCode: '',
  resolvedLocation: null,
};

@Component({
  selector: 'app-create-post',
  imports: [FormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost implements OnInit, OnDestroy {
  private router = inject(Router);
  private nextSelectedImageId = 1;

  readonly isLoading = signal(false);
  readonly isUploadingImages = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly backendErrors = signal<string[]>([]);
  readonly imagePickerError = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly savedPayload = signal<CreatePostRequest | null>(null);

  editPostId: number | null = null;
  postModel: PostBasicFormModel = { ...initialData };
  selectedImages: SelectedPostImage[] = [];

  get isEditMode(): boolean {
    return this.editPostId !== null;
  }

  constructor(
    private postsService: PostsService,
    private geoService: GeoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editPostId = Number(id);
      this.loadPostForEditing(this.editPostId);
    }
  }

  ngOnDestroy(): void {
    this.revokeSelectedImagePreviews();
  }

  readonly postTypeOptions: PostTypeOption[] = [
    { value: 'EVENT', label: 'Veranstaltung' },
    { value: 'SKILL', label: 'Hilfe / Skill' },
    { value: 'PRODUCT', label: 'Produkt' },
    { value: 'HOUSING', label: 'Wohnen' },
  ];

  readonly postModeOptions: PostModeOption[] = [
    { value: 'OFFER', label: 'Angebot' },
    { value: 'REQUEST', label: 'Gesuch' },
  ];

  loadPostForEditing(id: number): void {
    this.isLoading.set(true);

    this.postsService.getPostById(id).subscribe({
      next: (post: PostDetailResponse | null) => {
        if (!post) {
          this.errorMessage.set('Beitrag konnte nicht geladen werden.');
          this.isLoading.set(false);
          return;
        }

        this.postModel = {
          ...this.postModel,
          title: post.title ?? '',
          description: post.description ?? '',
          isUrgent: post.isUrgent ?? false,
          urgentUntil: post.urgentUntil ?? '',
        };

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Beitrag konnte nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }

  get isFormValid(): boolean {
    const v = this.postModel;

    if (!v.title.trim() || v.title.length > 120) return false;
    if (!v.description.trim() || v.description.length > 2000) return false;
    if (v.isUrgent && !v.urgentUntil) return false;

    if (!this.isEditMode) {
      if (!v.type || !v.postMode) return false;
      if (!this.hasRequiredDetails()) return false;
      if (!v.city.trim() || !v.postalCode.trim()) return false;
    }

    return true;
  }

  submitForm(): void {
    this.submitted.set(true);
    this.savedPayload.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.backendErrors.set([]);

    if (!this.isFormValid) return;

    if (this.isEditMode) {
      this.saveUpdatedPost();
      return;
    }


      this.isLoading.set(true);

    this.geoService.getCoordinates(
      this.postModel.postalCode,
      this.postModel.city,
      this.postModel.address
    ).subscribe({
        next: (coordinates) => {
          console.log('GEO OK', coordinates);

          this.postModel = {
            ...this.postModel,
            resolvedLocation: {
              city: this.postModel.city.trim(),
              postalCode: this.postModel.postalCode.trim(),
              address: this.postModel.address.trim() || null,
              lat: coordinates.latitude,
              lng: coordinates.longitude,
              precision: 'POSTAL_CODE',
              radius_m: 1000,
            },
          };

          const payload = this.createPayload();
          console.log('PAYLOAD', payload);

          this.createPost(payload);
        },
        error: (err) => {
          console.error('geo error', err);
          this.postModel = { ...this.postModel, resolvedLocation: null };
          this.errorMessage.set(err?.error?.message || 'Bitte ermittle gültige Koordinaten für die PLZ.');
          this.isLoading.set(false);
        },
      });

  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    this.imagePickerError.set(null);

    if (!files.length) {
      return;
    }

    const rejectedFiles = files.filter((file) => !file.type.startsWith('image/'));
    const acceptedFiles = files.filter((file) => file.type.startsWith('image/'));

    if (rejectedFiles.length) {
      this.imagePickerError.set('Es wurden nur Bilddateien übernommen.');
    }

    this.selectedImages = [
      ...this.selectedImages,
      ...acceptedFiles.map((file) => ({
        id: this.nextSelectedImageId++,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'selected' as const,
        error: null,
        uploadedImage: null,
      })),
    ];

    input.value = '';
  }

  removeSelectedImage(imageId: number): void {
    const image = this.selectedImages.find((selectedImage) => selectedImage.id === imageId);

    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }

    this.selectedImages = this.selectedImages.filter((selectedImage) => selectedImage.id !== imageId);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  getImageStatusLabel(image: SelectedPostImage): string {
    switch (image.status) {
      case 'selected':
        return 'Bereit zum Upload';
      case 'uploading':
        return `Upload läuft (${image.progress}%)`;
      case 'uploaded':
        return 'Hochgeladen';
      case 'error':
        return 'Upload fehlgeschlagen';
    }
  }

  private createPost(payload: CreatePostRequest): void {
    this.isLoading.set(true);

    this.postsService.createPost(payload).subscribe({
      next: (post: PostResponse) => {
        this.savedPayload.set(payload);
        this.handlePostCreated(post);
      },
      error: (err) => {
        console.error(err);

        const backendErrors = err?.error?.errors;

        if (backendErrors && typeof backendErrors === 'object') {
          this.backendErrors.set(
            Object.values(backendErrors).map((message) => this.mapBackendError(String(message))),
          );
          this.errorMessage.set(err?.error?.message || 'Bitte korrigiere die markierten Eingaben.');
        } else if (err.status === 401) {
          this.backendErrors.set([]);
          this.errorMessage.set('Du bist nicht eingeloggt. Bitte melde dich an.');
        } else if (err.status === 400) {
          this.backendErrors.set([]);
          this.errorMessage.set(err?.error?.message || 'Ungültige Eingabe.');
        } else {
          this.backendErrors.set([]);
          this.errorMessage.set('Beitrag konnte nicht gespeichert werden.');
        }

        this.isLoading.set(false);
      },
    });
  }

  private handlePostCreated(post: PostResponse): void {
    if (!this.selectedImages.length) {
      this.successMessage.set('Beitrag wurde erfolgreich erstellt.');
      this.isLoading.set(false);
      setTimeout(() => this.router.navigate(['/map']), 1500);
      return;
    }

    this.successMessage.set('Beitrag wurde erstellt. Bilder werden hochgeladen...');
    this.uploadSelectedImages(post.id);
  }

  private uploadSelectedImages(postId: number): void {
    this.isUploadingImages.set(true);

    Promise.all(this.selectedImages.map((image) => this.uploadSelectedImage(postId, image))).then(
      (results) => {
        const failedUploads = results.filter((result) => !result).length;

        this.isUploadingImages.set(false);
        this.isLoading.set(false);

        if (failedUploads > 0) {
          this.errorMessage.set(
            `${failedUploads} Bild${failedUploads === 1 ? '' : 'er'} konnte${
              failedUploads === 1 ? '' : 'n'
            } nicht hochgeladen werden. Der Beitrag wurde gespeichert.`,
          );
          this.successMessage.set('Beitrag wurde erstellt. Bitte prüfe die fehlerhaften Bilder.');
          return;
        }

        this.successMessage.set('Beitrag und Bilder wurden erfolgreich erstellt.');
        setTimeout(() => this.router.navigate(['/map']), 1500);
      },
    );
  }

  private uploadSelectedImage(postId: number, image: SelectedPostImage): Promise<boolean> {
    image.status = 'uploading';
    image.progress = 0;
    image.error = null;

    return new Promise((resolve) => {
      this.postsService.uploadPostImageFileWithProgress(postId, image.file).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            image.progress = event.total ? Math.round((event.loaded / event.total) * 100) : 50;
            return;
          }

          if (event.type === HttpEventType.Response) {
            image.status = 'uploaded';
            image.progress = 100;
            image.uploadedImage = event.body ?? null;
            resolve(true);
          }
        },
        error: (error) => {
          image.status = 'error';
          image.error = this.mapUploadError(error);
          resolve(false);
        },
      });
    });
  }

  private saveUpdatedPost(): void {
    const payload: UpdatePostRequest = {
      title: this.postModel.title.trim(),
      description: this.postModel.description.trim(),
      isUrgent: this.postModel.isUrgent,
      urgentUntil:
        this.postModel.isUrgent && this.postModel.urgentUntil ? this.postModel.urgentUntil : null,
    };

    this.isLoading.set(true);

    this.postsService.updatePost(this.editPostId!, payload).subscribe({
      next: () => {
        this.successMessage.set('Beitrag wurde erfolgreich aktualisiert.');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        const backendMessage = err?.error?.errors?.request || err?.error?.message;
        this.errorMessage.set(
          backendMessage || 'Beitrag konnte nicht gespeichert werden. Bitte versuche es erneut.',
        );
        this.isLoading.set(false);
      },
    });
  }

  resetForm(): void {
    this.submitted.set(false);
    this.savedPayload.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.backendErrors.set([]);
    this.imagePickerError.set(null);
    this.revokeSelectedImagePreviews();
    this.selectedImages = [];
    this.postModel = { ...initialData };
  }

  shouldShowFieldError(field: 'title' | 'description' | 'type' | 'postMode'): boolean {
    if (!this.submitted()) return false;

    switch (field) {
      case 'title':
        return !this.postModel.title.trim() || this.postModel.title.length > 120;
      case 'description':
        return !this.postModel.description.trim() || this.postModel.description.length > 2000;
      case 'type':
        return !this.postModel.type;
      case 'postMode':
        return !this.postModel.postMode;
    }
  }

  getFieldErrorMessage(field: 'title' | 'description' | 'type' | 'postMode'): string {
    switch (field) {
      case 'title':
        if (!this.postModel.title.trim()) return 'Bitte gib einen Titel ein.';
        if (this.postModel.title.length > 120) return 'Der Titel darf maximal 120 Zeichen lang sein.';
        return '';
      case 'description':
        if (!this.postModel.description.trim()) return 'Bitte gib eine Beschreibung ein.';
        if (this.postModel.description.length > 2000)
          return 'Die Beschreibung darf maximal 2000 Zeichen lang sein.';
        return '';
      case 'type':
        return 'Bitte wähle einen Typ aus.';
      case 'postMode':
        return 'Bitte wähle Angebot oder Gesuch aus.';
    }
  }

  shouldShowUrgentUntilError(): boolean {
    return this.submitted() && this.postModel.isUrgent && !this.postModel.urgentUntil;
  }

  shouldShowDetailsError(): boolean {
    return this.submitted() && !this.isEditMode && !this.hasRequiredDetails();
  }

  getLocationErrorMessage(): string | null {
    const v = this.postModel;

    if (!this.submitted()) return null;
    if (!v.city.trim()) return 'Bitte gib eine Stadt ein.';
    if (!v.postalCode.trim()) return 'Bitte gib eine Postleitzahl ein.';

    return null;
  }

  private createPayload(): CreatePostRequest {
    const value = this.postModel;

    return {
      title: value.title.trim(),
      description: value.description.trim(),
      type: value.type,
      postMode: value.postMode,
      isUrgent: value.isUrgent,
      urgentUntil: value.isUrgent && value.urgentUntil ? value.urgentUntil : null,
      location: value.resolvedLocation,
      details: this.createDetails(),
    };
  }

  private hasRequiredDetails(): boolean {
    const value = this.postModel;

    switch (value.type) {
      case 'EVENT':
        return !!value.eventStartDate && !!value.eventEndDate && !!value.eventVenue.trim();
      case 'SKILL':
        return (
          !!value.skillTags.trim() &&
          !!value.availabilityNote.trim() &&
          !!value.experienceLevel.trim()
        );
      case 'PRODUCT':
        return (
          !!value.productName.trim() &&
          !!value.price &&
          !!value.currency.trim() &&
          !!value.condition.trim()
        );
      case 'HOUSING':
        return (
          !!value.housingType.trim() && !!value.rent && !!value.rooms && !!value.availableFrom
        );
    }
  }

  private createDetails(): CreatePostRequest['details'] {
    const value = this.postModel;

    switch (value.type) {
      case 'EVENT':
        return {
          detailType: 'EVENT',
          startDate: value.eventStartDate,
          endDate: value.eventEndDate,
          venue: value.eventVenue.trim(),
        };
      case 'SKILL':
        return {
          detailType: 'SKILL',
          skillName: '',
          skillTags: value.skillTags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          availabilityNote: value.availabilityNote.trim(),
          experienceLevel: value.experienceLevel.trim(),
        };
      case 'PRODUCT':
        return {
          detailType: 'PRODUCT',
          productName: value.productName.trim(),
          price: this.toOptionalNumber(value.price),
          currency: value.currency.trim(),
          condition: value.condition.trim(),
        };
      case 'HOUSING':
        return {
          detailType: 'HOUSING',
          housingType: value.housingType.trim(),
          rent: this.toOptionalNumber(value.rent),
          rooms: this.toOptionalNumber(value.rooms),
          availableFrom: value.availableFrom,
        };
    }
  }

  private toOptionalNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalizedValue = String(value).trim().replace(',', '.');

    return normalizedValue ? Number(normalizedValue) : null;
  }

  private mapBackendError(message: string): string {
    switch (message) {
      case 'Location must not be null':
        return 'Die Location konnte nicht gespeichert werden. Bitte überprüfe die Ortsangaben.';
      default:
        return message;
    }
  }

  private mapUploadError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'Du bist nicht eingeloggt. Bitte melde dich erneut an.';
      }

      if (error.status === 413) {
        return 'Die Datei ist zu groß für den Upload.';
      }

      return error.error?.message || 'Bild konnte nicht hochgeladen werden.';
    }

    return 'Bild konnte nicht hochgeladen werden.';
  }

  private revokeSelectedImagePreviews(): void {
    for (const image of this.selectedImages) {
      URL.revokeObjectURL(image.previewUrl);
    }
  }
}
