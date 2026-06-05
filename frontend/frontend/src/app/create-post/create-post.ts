import {Component, computed, inject, signal} from '@angular/core';
import {form, FormField, maxLength, required} from '@angular/forms/signals';
import {CreatePostLocationDto, CreatePostRequest, PostMode, PostType} from '../models/post.model';
import {PostsService} from '../services/posts.service';
import {GeoService} from '../services/geo.service';
import {Router} from '@angular/router';

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

const initialData: PostBasicFormModel = {
  title: '',
  description: '',
  type: 'SKILL',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: '',
  hasLocation: false,
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
  imports: [FormField],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {
  private router = inject(Router);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly savedPayload = signal<CreatePostRequest | null>(null);
  readonly postModel = signal<PostBasicFormModel>({...initialData});

  constructor(private postsService: PostsService, private geoService: GeoService,) {
  }

  readonly postTypeOptions: PostTypeOption[] = [
    {value: 'EVENT', label: 'Veranstaltung'},
    {value: 'SKILL', label: 'Hilfe / Skill'},
    {value: 'PRODUCT', label: 'Produkt'},
    {value: 'HOUSING', label: 'Wohnen'},
  ];

  readonly postModeOptions: PostModeOption[] = [
    {value: 'OFFER', label: 'Angebot'},
    {value: 'REQUEST', label: 'Gesuch'},
  ];

  readonly postForm = form(this.postModel, (schemaPath) => {
    required(schemaPath.title, {message: 'Bitte gib einen Titel ein.'});
    maxLength(schemaPath.title, 120, {
      message: 'Der Titel darf maximal 120 Zeichen lang sein.',
    });

    required(schemaPath.description, {message: 'Bitte gib eine Beschreibung ein.'});
    maxLength(schemaPath.description, 2000, {
      message: 'Die Beschreibung darf maximal 2000 Zeichen lang sein.',
    });

    required(schemaPath.type, {message: 'Bitte wähle einen Typ aus.'});
    required(schemaPath.postMode, {message: 'Bitte wähle Angebot oder Gesuch aus.'});
  });

  readonly payloadPreview = computed(() => this.createPayload());

  readonly isFormValid = computed(
    () =>
      !this.postForm.title().invalid() &&
      !this.postForm.description().invalid() &&
      !this.postForm.type().invalid() &&
      !this.postForm.postMode().invalid() &&
      (!this.postModel().isUrgent || !!this.postModel().urgentUntil) &&
      this.hasRequiredDetails() &&
      (!this.postModel().hasLocation ||
        (!!this.postModel().city.trim() &&
          !!this.postModel().postalCode.trim()))
  );

  submitForm() {
    this.submitted.set(true);
    this.savedPayload.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.isFormValid()) {
      return;
    }

    const value = this.postModel();

    if (value.hasLocation) {
      this.isLoading.set(true);

      this.geoService.getCoordinatesByPlz(value.postalCode).subscribe({
        next: (coordinates) => {
          this.postModel.update((currentValue) => ({
            ...currentValue,
            resolvedLocation: {
              lat: coordinates.latitude,
              lng: coordinates.longitude,
              precision: 'POSTAL_CODE',
              radius_m: 1000,
            },
          }));

          const payload = this.createPayload();
          this.createPost(payload, () => {
            setTimeout(() => this.router.navigate(['/map']), 1500);
          });

        },
        error: (err) => {
          console.error('geo error', err);

          this.postModel.update((currentValue) => ({
            ...currentValue,
            resolvedLocation: null,
          }));

          this.errorMessage.set('Bitte ermittle gültige Koordinaten für die PLZ.');
          this.isLoading.set(false);
        },
      });

      return;
    }

    const payload = this.createPayload();
    this.createPost(payload, () => {
      setTimeout(() => this.router.navigate(['/posts']), 1500);
    });

  }

  private createPost(payload: CreatePostRequest, onSuccess?: () => void) {
    this.isLoading.set(true);

    this.postsService.createPost(payload).subscribe({
      next: () => {
        this.savedPayload.set(payload);
        this.successMessage.set('Beitrag wurde erfolgreich erstellt.');
        this.isLoading.set(false);
        onSuccess?.();
      },
      error: (err) => {
        console.error(err);

        if (err.status === 401) {
          this.errorMessage.set('Du bist nicht eingeloggt. Bitte melde dich an.');
        }

        const backendMessage = err?.error?.errors?.request || err?.error?.message;

        if (err.status === 400) {
          this.errorMessage.set(backendMessage || 'Ungültige Eingabe.');
        } else {
          this.errorMessage.set('Beitrag konnte nicht gespeichert werden.');
        }

        this.isLoading.set(false);
      },
    });
  }

  resetForm() {
    this.submitted.set(false);
    this.savedPayload.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.postModel.set({...initialData});
  }

  shouldShowFieldError(field: 'title' | 'description' | 'type' | 'postMode') {
    return this.submitted() && this.postForm[field]().invalid();
  }

  shouldShowUrgentUntilError() {
    return this.submitted() && this.postModel().isUrgent && !this.postModel().urgentUntil;
  }

  shouldShowDetailsError() {
    return this.submitted() && !this.hasRequiredDetails();
  }

  getLocationErrorMessage() {
    const value = this.postModel();

    if (!this.submitted() || !value.hasLocation) {
      return null;
    }

    if (!value.city.trim()) {
      return 'Bitte gib eine Stadt ein.';
    }

    if (!value.postalCode.trim()) {
      return 'Bitte gib eine Postleitzahl ein.';
    }

    return null;
  }

  private createPayload(): CreatePostRequest {
    const value = this.postModel();

    return {
      title: value.title.trim(),
      description: value.description.trim(),
      type: value.type,
      postMode: value.postMode,
      isUrgent: value.isUrgent,
      urgentUntil: value.isUrgent && value.urgentUntil ? value.urgentUntil : null,
      location: value.hasLocation ? value.resolvedLocation : null,
      details: this.createDetails(),
    };
  }

  private hasRequiredDetails() {
    const value = this.postModel();

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
          !!value.housingType.trim() &&
          !!value.rent &&
          !!value.rooms &&
          !!value.availableFrom
        );
    }
  }

  private createDetails(): CreatePostRequest['details'] {
    const value = this.postModel();

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

  private toOptionalNumber(value: string) {
    const normalizedValue = value.trim();
    return normalizedValue ? Number(normalizedValue) : null;
  }
}
