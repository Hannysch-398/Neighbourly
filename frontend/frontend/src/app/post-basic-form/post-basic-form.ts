import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePostRequest, PostType } from '../models/post.model';

type PostTypeOption = {
  value: PostType;
  label: string;
};

@Component({
  selector: 'app-post-basic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-basic-form.html',
  styleUrl: './post-basic-form.css',
})
export class PostBasicForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly submitted = signal(false);
  readonly savedPayload = signal<CreatePostRequest | null>(null);

  readonly postTypeOptions: PostTypeOption[] = [
    { value: 'EVENT', label: 'Veranstaltung' },
    { value: 'SKILL', label: 'Hilfe / Skill' },
    { value: 'PRODUCT', label: 'Produkt' },
    { value: 'HOUSING', label: 'Wohnen' },
  ];

  readonly postForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    type: ['SKILL' as PostType, [Validators.required]],
    isUrgent: [false],
    urgentUntil: [{ value: '', disabled: true }],
  });

  readonly payloadPreview = computed(() => this.createPayload());

  constructor() {
    this.postForm.controls.isUrgent.valueChanges.subscribe((isUrgent) => {
      const urgentUntilControl = this.postForm.controls.urgentUntil;

      if (isUrgent) {
        urgentUntilControl.enable();
        urgentUntilControl.addValidators(Validators.required);
      } else {
        urgentUntilControl.reset('');
        urgentUntilControl.clearValidators();
        urgentUntilControl.disable();
      }

      urgentUntilControl.updateValueAndValidity();
    });
  }

  submitForm() {
    this.submitted.set(true);
    this.savedPayload.set(null);

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.savedPayload.set(this.createPayload());
  }

  resetForm() {
    this.submitted.set(false);
    this.savedPayload.set(null);
    this.postForm.reset({
      title: '',
      description: '',
      type: 'SKILL',
      isUrgent: false,
      urgentUntil: '',
    });
    this.postForm.controls.urgentUntil.disable();
  }

  shouldShowError(controlName: keyof typeof this.postForm.controls) {
    const control = this.postForm.controls[controlName];
    return control.invalid && (this.submitted() || control.dirty);
  }

  private createPayload(): CreatePostRequest {
    const rawValue = this.postForm.getRawValue();

    return {
      title: rawValue.title.trim(),
      description: rawValue.description.trim(),
      type: rawValue.type,
      isUrgent: rawValue.isUrgent,
      urgentUntil: rawValue.isUrgent && rawValue.urgentUntil ? rawValue.urgentUntil : null,
    };
  }
}
