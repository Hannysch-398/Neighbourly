import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterModule} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { VerifyEmailService } from  "../service/verify-email-service"


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.html',
  imports: [
    RouterLink, RouterModule
  ],
  styleUrls: ['./verify-email.css']
})
export class VerifyEmail implements OnInit {
  message = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private verifyEmailService: VerifyEmailService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.errorMessage = 'Kein Token gefunden.';
      return;
    }

    this.verifyEmailService.verifyEmail(token).subscribe({
      next: (response: string) => {
        this.message = response;
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);

        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage =
            error.error?.message || 'Ein unbekannter Fehler ist aufgetreten.';
        }
      },
    });
  }
}
