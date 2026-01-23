import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

/**
 * Global Error Handling Interceptor
 * Catches HTTP errors and handles them consistently across the application
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle different HTTP status codes
      switch (error.status) {
        case 0:
          // Network error
          notificationService.error(
            'Erro de conexão',
            'Não foi possível conectar ao servidor. Verifique sua conexão.'
          );
          break;

        case 400:
          // Bad Request
          const message400 = error.error?.message || 'Requisição inválida';
          notificationService.error('Erro de validação', message400);
          break;

        case 401:
          // Unauthorized - Token expirado ou inválido
          authService.logout();
          notificationService.error(
            'Sessão expirada',
            'Sua sessão expirou. Faça login novamente.'
          );
          router.navigate(['/auth/login']);
          break;

        case 403:
          // Forbidden
          notificationService.error(
            'Acesso negado',
            'Você não tem permissão para acessar este recurso.'
          );
          break;

        case 404:
          // Not Found
          notificationService.error(
            'Não encontrado',
            'O recurso solicitado não foi encontrado.'
          );
          break;

        case 409:
          // Conflict - Duplicate resource
          notificationService.error(
            'Recurso duplicado',
            error.error?.message || 'Este recurso já existe.'
          );
          break;

        case 422:
          // Unprocessable Entity - Validation error
          const message422 = error.error?.message || 'Dados inválidos';
          notificationService.error('Erro de validação', message422);
          break;

        case 429:
          // Too Many Requests - Rate limiting
          notificationService.error(
            'Muitas requisições',
            'Aguarde um pouco antes de tentar novamente.'
          );
          break;

        case 500:
          // Internal Server Error
          notificationService.error(
            'Erro no servidor',
            'Ocorreu um erro no servidor. Tente novamente mais tarde.'
          );
          break;

        case 502:
        case 503:
        case 504:
          // Service unavailable
          notificationService.error(
            'Serviço indisponível',
            'O servidor está temporariamente indisponível. Tente novamente mais tarde.'
          );
          break;

        default:
          // Other errors
          notificationService.error(
            'Erro',
            error.error?.message || 'Ocorreu um erro inesperado.'
          );
      }

      // Log error to console in development
      console.error('[HTTP Error]', error);

      // Propagate error for component-level handling if needed
      return throwError(() => error);
    })
  );
};
