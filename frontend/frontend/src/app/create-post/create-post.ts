
import { Component, computed, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { CreatePostRequest, PostType } from '../models/post.model';
import {MapComponent} from '../map-component/map-component';

type PostTypeOption = {
  value: PostType;
  label: string;
};

type PostBasicFormModel = {
  title: string;
  description: string;
  type: PostType;
  isUrgent: boolean;
  urgentUntil: string;
  hasLocation: boolean;
  locationAddress: string;
  latitude: number | null;
  longitude: number | null;
};

const initialData: PostBasicFormModel = {
  title: '',
  description: '',
  type: 'SKILL',
  isUrgent: false,
  urgentUntil: '',
  hasLocation: false,
  locationAddress: '',
  latitude: null,
  longitude: null,
};

@Component({
  selector: 'app-create-post',
  imports: [
    FormField,
    MapComponent
  ],
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

  readonly postTypeOptions: PostTypeOption[] = [
    { value: 'EVENT', label: 'Veranstaltung' },
    { value: 'SKILL', label: 'Hilfe / Skill' },
    { value: 'PRODUCT', label: 'Produkt' },
    { value: 'HOUSING', label: 'Wohnen' },
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
  });

  readonly payloadPreview = computed(() => this.createPayload());
  readonly isFormValid = computed(
    () =>
      !this.postForm.title().invalid() &&
      !this.postForm.description().invalid() &&
      !this.postForm.type().invalid() &&
      (!this.postModel().isUrgent || !!this.postModel().urgentUntil) &&
      (!this.postModel().hasLocation || !!this.postModel().locationAddress.trim())
  );

  submitForm() {
    this.submitted.set(true);
    this.savedPayload.set(null);

    if (!this.isFormValid()) {
      return;
    }

    this.savedPayload.set(this.createPayload());
  }

  resetForm() {
    this.submitted.set(false);
    this.savedPayload.set(null);
    this.postModel.set({ ...initialData });
  }

  shouldShowFieldError(field: 'title' | 'description' | 'type') {
    return this.submitted() && this.postForm[field]().invalid();
  }

  shouldShowUrgentUntilError() {
    return this.submitted() && this.postModel().isUrgent && !this.postModel().urgentUntil;
  }

  shouldShowLocationAddressError() {
    return this.submitted() && this.postModel().hasLocation && !this.postModel().locationAddress.trim();
  }

  private createPayload(): CreatePostRequest {
    const value = this.postModel();

    return {
      title: value.title.trim(),
      description: value.description.trim(),
      type: value.type,
      isUrgent: value.isUrgent,
      urgentUntil: value.isUrgent && value.urgentUntil ? value.urgentUntil : null,
      location: value.hasLocation
        ? {
            address: value.locationAddress.trim(),
            precision: 'EXACT',
          }
        : null,
    };
  }
  async searchAddress() {
    const address = this.postModel().locationAddress.trim();

    if (!address) {
      return;
    }

    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    const results = await response.json();

    if (!results.length) {
      this.errorMessage.set('Adresse wurde nicht gefunden.');
      return;
    }

    const result = results[0];

    this.postModel.update((value) => ({
      ...value,
      latitude: Number(result.lat),
      longitude: Number(result.lon),
    }));
  }
  setLocationFromMap(location: { latitude: number; longitude: number }) {
    this.postModel.update((value) => ({
      ...value,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  }
}
