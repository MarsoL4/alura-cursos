import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrotasService } from '../../services/frotas.service';
import { AlertaManutencaoPersistido } from '../../models';

@Component({
  selector: 'app-alertas-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="alertas-page">
      <div class="page-header">
        <h1>Alertas de Manutenção</h1>
      </div>

      <div class="filtros">
        <select [(ngModel)]="statusFiltro" (ngModelChange)="filtrar()">
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="ENVIADO">Enviado</option>
          <option value="FALHA">Falha</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Carregando alertas...</div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Km Atual</th>
            <th>Motivo</th>
            <th>Status</th>
            <th>Data Criação</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let alerta of alertasFiltrados">
            <td>{{ alerta.id }}</td>
            <td>{{ alerta.placa }}</td>
            <td>{{ alerta.modelo }}</td>
            <td>{{ alerta.quilometragemAtual | number }} km</td>
            <td>
              <span class="motivo-badge" [ngClass]="'motivo-' + alerta.motivoAlerta">
                {{ alerta.motivoAlerta === 'QUILOMETRAGEM_EXCEDIDA' ? 'Km Excedida' : 'Prazo Excedido' }}
              </span>
            </td>
            <td>
              <span class="status-badge" [ngClass]="'status-' + alerta.statusNotificacao">
                {{ alerta.statusNotificacao }}
              </span>
            </td>
            <td>{{ alerta.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && alertasFiltrados.length === 0" class="empty-state">
        Nenhum alerta encontrado.
      </div>
    </div>
  `,
  styles: [`
    .alertas-page { padding: 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h1 { margin: 0; color: #333; font-size: 24px; }
    .filtros { margin-bottom: 16px; }
    .filtros select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; }
    .loading { text-align: center; padding: 40px; color: #666; }
    .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .data-table th { text-align: left; padding: 14px; background: #f5f5f5; color: #666; font-size: 13px; text-transform: uppercase; }
    .data-table td { padding: 14px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
    .data-table tr:hover { background: #f9f9f9; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status-PENDENTE { background: #fff3e0; color: #e65100; }
    .status-ENVIADO { background: #e8f5e9; color: #2e7d32; }
    .status-FALHA { background: #ffebee; color: #c62828; }
    .motivo-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .motivo-QUILOMETRAGEM_EXCEDIDA { background: #e3f2fd; color: #1565c0; }
    .motivo-PRAZO_EXCEDIDO { background: #fce4ec; color: #880e4f; }
    .empty-state { text-align: center; padding: 40px; color: #999; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  `]
})
export class AlertasManutencaoComponent implements OnInit {
  alertas: AlertaManutencaoPersistido[] = [];
  alertasFiltrados: AlertaManutencaoPersistido[] = [];
  statusFiltro = '';
  loading = true;

  constructor(private frotasService: FrotasService) {}

  ngOnInit(): void {
    this.carregarAlertas();
  }

  async carregarAlertas(): Promise<void> {
    this.loading = true;
    this.alertas = await this.frotasService.getAlertasManutencao();
    this.alertasFiltrados = this.alertas;
    this.loading = false;
  }

  filtrar(): void {
    if (!this.statusFiltro) {
      this.alertasFiltrados = this.alertas;
    } else {
      this.alertasFiltrados = this.alertas.filter(a => a.statusNotificacao === this.statusFiltro);
    }
  }
}
