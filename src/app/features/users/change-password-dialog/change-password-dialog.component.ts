import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ButtonComponent, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" title="Alterar Senha" (closed)="onCancel()">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
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

        <div modal-actions>
          <app-button type="button" variant="secondary" (click)="onCancel()" [disabled]="isLoading">
            Cancelar
          </app-button>
          <app-button 
            type="submit" 
            variant="primary" 
            [loading]="isLoading"
            [disabled]="form.invalid"
            loadingText="Alterando..."
          >
            Alterar Senha
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
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

