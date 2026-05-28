import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from '../../services/auth.service';

describe('AuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        {
          provide: AuthService,
          useValue: {
            getToken: () => null,
            logout: () => Promise.resolve(true),
          },
        },
        {
          provide: Router,
          useValue: {
            url: '/',
            navigate: () => Promise.resolve(true),
          },
        },
      ],
    });
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(AuthInterceptor);

    expect(interceptor).toBeTruthy();
  });
});
