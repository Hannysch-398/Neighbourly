import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authApiPath = '/api/auth/';

  private authRedirectInProgress = false;
  private forbiddenRedirectInProgress = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthRequest = req.url.includes(this.authApiPath);
    const token = this.authService.getToken();

    const requestWithAuth =
      token && !isAuthRequest
        ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        })
        : req;

    return next.handle(requestWithAuth).pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(() => error);
        }

        if (error.status === HttpStatusCode.Unauthorized && !isAuthRequest) {
          this.handleUnauthorized();
        }

        if (error.status === HttpStatusCode.Forbidden) {
          this.handleForbidden();
        }

        return throwError(() => error);
      }),
    );
  }

  private handleUnauthorized(): void {
    if (this.isOnLoginPage() || this.authRedirectInProgress) {
      return;
    }

    this.authRedirectInProgress = true;

    void this.authService
      .logout(this.router.url)
      .finally(() => {
        this.authRedirectInProgress = false;
      });
  }

  private handleForbidden(): void {
    if(this.isOnAccessDeniedPage() || this.forbiddenRedirectInProgress) {
      return;
    }

    this.forbiddenRedirectInProgress = true;

    void this.router
      .navigate(['/access-denied'])
      .finally(() => {
        this.forbiddenRedirectInProgress = false;
      });
  }

  private isOnLoginPage(): boolean {
    return this.router.url.split('?')[0] === '/access-denied';
  }

  private isOnAccessDeniedPage(): boolean {
    return this.router.url.split('?')[0] === '/access-denied';
  }
}
