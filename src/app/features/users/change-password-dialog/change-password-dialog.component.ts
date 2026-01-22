import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()" *ngIf="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Alterar Senha</h2>
          <button class="close-btn" (click)="onCancel()">✕</button>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label for="newPassword">Nova Senha</label>
            <input
              id="newPassword"
              type="password"
              class="form-input"
              formControlName="newPassword"
              placeholder="Digite a nova senha"
            />
            <span class="error" *ngIf="form.get('newPassword')?.hasError('required')">
              Senha é obrigatória
            </span>
            <span class="error" *ngIf="form.get('newPassword')?.hasError('minlength')">
              Mínimo 6 caracteres
            </span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-input"
              formControlName="confirmPassword"
              placeholder="Confirme a senha"
            />
            <span class="error" *ngIf="form.get('confirmPassword')?.hasError('required')">
              Confirme a senha
            </span>
            <span class="error" *ngIf="form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched">
              As senhas não coincidem
            </span>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()" [disabled]="isLoading">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isLoading">
              <span *ngIf="!isLoading">Alterar Senha</span>
              <span *ngIf="isLoading" class="loading-text">
                <span class="spinner-mini"></span>
                Alterando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 400px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      transition: color 0.3s;
    }

    .close-btn:hover {
      color: #333;
    }

    .modal-body {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    }

    .error {
      display: block;
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .loading-text {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .spinner-mini {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin-mini 0.6s linear infinite;
    }

    @keyframes spin-mini {
      to { transform: rotate(360deg); }
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `],
})
export class ChangePasswordDialogComponent {
  @Output() passwordChanged = new EventEmitter<string | null>();

  form: FormGroup;
  isOpen = false;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { passwordMismatch: true };
  }

  open(): void {
    this.isOpen = true;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const newPassword = this.form.get('newPassword')?.value;
      this.passwordChanged.emit(newPassword);
      // Loading state will be reset by parent when handling response
      setTimeout(() => {
        this.isLoading = false;
        this.close();
      }, 500);
    }
  }

  onCancel(): void {
    this.passwordChanged.emit(null);
    this.close();
  }

  private close(): void {
    this.isOpen = false;
    this.form.reset();
  }
}

