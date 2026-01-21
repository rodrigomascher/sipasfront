import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>SIPAS</h1>
        <h2>Sistema Integrado de Prontuário e Assistência Social</h2>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-box {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #667eea;
      text-align: center;
      margin-bottom: 10px;
    }

    h2 {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-bottom: 30px;
      font-weight: 400;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    button {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      margin-top: 20px;
      padding: 12px;
      border-radius: 4px;
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }
  `]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.error = 'Email e senha são obrigatórios';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.authService.setToken(response.access_token);
        this.authService.setUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erro ao fazer login. Tente novamente.';
      }
    });
  }
}
