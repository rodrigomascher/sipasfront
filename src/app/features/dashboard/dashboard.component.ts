import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>
      
      <div class="grid-3">
        <div class="stat-card">
          <h3>Unidades</h3>
          <p class="stat-number">12</p>
          <p class="stat-label">Unidades ativas</p>
        </div>
        
        <div class="stat-card">
          <h3>Departamentos</h3>
          <p class="stat-number">8</p>
          <p class="stat-label">Departamentos</p>
        </div>
        
        <div class="stat-card">
          <h3>Funcionários</h3>
          <p class="stat-number">156</p>
          <p class="stat-label">Total de funcionários</p>
        </div>
      </div>

      <div class="card">
        <h3>Bem-vindo ao SIPAS</h3>
        <p>
          Sistema de Integração de Permissões e Auditoria de Segurança
        </p>
        <p>
          Use o menu de navegação acima para acessar as diferentes seções do sistema.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem;
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
      border-top: 4px solid #1976d2;

      h3 {
        font-size: 0.875rem;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 1rem;
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1976d2;
        margin: 0.5rem 0;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #999;
      }
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h3 {
        margin-bottom: 1rem;
        color: #333;
      }

      p {
        margin-bottom: 0.5rem;
        color: #666;
        line-height: 1.6;
      }
    }
  `]
})
export class DashboardComponent {}
