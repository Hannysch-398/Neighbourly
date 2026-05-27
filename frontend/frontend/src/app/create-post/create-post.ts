import { Component, computed, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { CreatePostRequest, PostMode, PostType } from '../models/post.model';
import { MapComponent } from '../map-component/map-component';
import { PostsService } from '../service/posts.service';

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
  district: string;
  address: string;
  eventStartDate: string;
  eventEndDate: string;
  eventVenue: string;
  skillName: string;
  experienceLevel: string;
  productName: string;
  price: string;
  housingType: string;
  rent: string;
  showLargeMap: boolean;
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
  district: '',
  address: '',
  eventStartDate: '',
  eventEndDate: '',
  eventVenue: '',
  skillName: '',
  experienceLevel: '',
  productName: '',
  price: '',
  housingType: '',
  rent: '',
  showLargeMap: false,
};

@Component({
  selector: 'app-create-post',
  imports: [FormField],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly savedPayload = signal<CreatePostRequest | null>(null);
  readonly postModel = signal<PostBasicFormModel>({ ...initialData });

  constructor(private postsService: PostsService) {}

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

  readonly postForm = form(this.postModel, (schemaPath) => {
    required(schemaPath.title, { message: 'Bitte gib einen Titel ein.' });
    maxLength(schemaPath.title, 120, {
      message: 'Der Titel darf maximal 120 Zeichen lang sein.',
    });

    required(schemaPath.description, { message: 'Bitte gib eine Beschreibung ein.' });
    maxLength(schemaPath.description, 2000, {
      message: 'Die Beschreibung darf maximal 2000 Zeichen lang sein.',
    });

    required(schemaPath.type, { message: 'Bitte wähle einen Typ aus.' });
    required(schemaPath.postMode, { message: 'Bitte wähle Angebot oder Gesuch aus.' });
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
      (!this.postModel().hasLocation || !!this.postModel().city.trim()),
  );

  submitForm() {
    this.submitted.set(true);
    this.savedPayload.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.isFormValid()) {
      return;
    }

    const payload = this.createPayload();
    this.isLoading.set(true);

    this.postsService.createPost(payload).subscribe({
      next: () => {
        this.savedPayload.set(payload);
        this.successMessage.set('Beitrag wurde erfolgreich erstellt.');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);

        const backendMessage = err?.error?.errors?.request;

        this.errorMessage.set(
          backendMessage ||
          'Beitrag konnte nicht gespeichert werden. Bitte versuche es erneut.'
        );

        this.isLoading.set(false);
      },
    });
  }

  resetForm() {
    this.submitted.set(false);
    this.savedPayload.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.postModel.set({ ...initialData });
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

  shouldShowLocationError() {
    return this.submitted() && this.postModel().hasLocation && !this.postModel().city.trim();
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
      location: value.hasLocation
        ? {
            city: value.city.trim(),
            district: value.district.trim() || null,
            address: value.address.trim() || null,
            latitude: null,
            longitude: null,
          }
        : null,
      details: this.createDetails(),
    };
  }

  private hasRequiredDetails() {
    const value = this.postModel();

    switch (value.type) {
      case 'EVENT':
        return !!value.eventStartDate && !!value.eventEndDate && !!value.eventVenue.trim();
      case 'SKILL':
        return !!value.skillName.trim() && !!value.experienceLevel.trim();
      case 'PRODUCT':
        return !!value.productName.trim() && !!value.price;
      case 'HOUSING':
        return !!value.housingType.trim() && !!value.rent;
    }
  }

  private createDetails(): CreatePostRequest['details'] {
    const value = this.postModel();

    switch (value.type) {
      case 'EVENT':
        return {
          startDate: value.eventStartDate,
          endDate: value.eventEndDate,
          venue: value.eventVenue.trim(),
        };
      case 'SKILL':
        return {
          skillName: value.skillName.trim(),
          experienceLevel: value.experienceLevel.trim(),
        };
      case 'PRODUCT':
        return {
          productName: value.productName.trim(),
          price: this.toOptionalNumber(value.price),
        };
      case 'HOUSING':
        return {
          housingType: value.housingType.trim(),
          rent: this.toOptionalNumber(value.rent),
        };
    }
  }

  private toOptionalNumber(value: string) {
    const normalizedValue = value.trim();
    return normalizedValue ? Number(normalizedValue) : null;
  }
}
