import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { finalize } from 'rxjs';
import { AgentApiService } from './agent-api.service';
import { AgentQueryResponse, SummaryChip } from './models';
import {
  BarLineOptions,
  PieOptions,
  buildBarOptions,
  buildLineOptions,
  buildPieOptions,
  detectChartModel,
  extractRows,
  getDisplayRows
} from './chart-mapper';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly chips: SummaryChip[] = [
    { label: 'Top products last 30 days', query: 'Show me the top products in the last 30 days' },
    { label: 'Sales trend 6 months', query: 'Show me the sales trend for the last 6 months' },
    { label: 'Best categories this month', query: 'Show me the best performing categories this month' },
    { label: 'Stockout risk', query: 'Show me stockout risk for this month' }
  ];

  query = signal('Show me the top products in the last 30 days');
  activeView = signal<'chart' | 'table'>('chart');
  loading = signal(false);
  error = signal('');
  response = signal<AgentQueryResponse | null>(null);
  chartTitle = signal('Result visualization');
  barLineOptions = signal<BarLineOptions | null>(null);
  pieOptions = signal<PieOptions | null>(null);
  tableRows = signal<Record<string, unknown>[]>([]);
  tableColumns = signal<string[]>([]);

  readonly hasResponse = computed(() => !!this.response());
  readonly hasRows = computed(() => this.tableRows().length > 0);

  constructor(private readonly agentApi: AgentApiService) {}

  runSearch(): void {
    const question = this.query().trim();
    if (!question) {
      this.error.set('Enter a question to search.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.response.set(null);
    this.barLineOptions.set(null);
    this.pieOptions.set(null);
    this.tableRows.set([]);
    this.tableColumns.set([]);

    this.agentApi.query({
      question,
      tenantId: environment.defaultTenantId,
      accountIds: environment.defaultAccountIds,
      marketplaceCodes: environment.defaultMarketplaceCodes
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: (result) => this.handleResponse(result),
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Unable to fetch results from Agent Service.';
        this.error.set(message);
      }
    });
  }

  applyChip(chip: SummaryChip): void {
    this.query.set(chip.query);
    this.runSearch();
  }

  setView(view: 'chart' | 'table'): void {
    this.activeView.set(view);
  }

  trackByIndex(index: number): number {
    return index;
  }

  formatCell(value: unknown): string {
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private handleResponse(result: AgentQueryResponse): void {
    this.response.set(result);
    const rows = getDisplayRows(extractRows(result));
    this.tableRows.set(rows);
    this.tableColumns.set(rows.length ? Object.keys(rows[0]) : []);

    const chartType = (result.chartType || 'TABLE').toUpperCase();
    const model = detectChartModel(result);
    this.chartTitle.set(`${result.selectedTool} · ${model.metricLabel}`);

    if (!rows.length) {
      this.activeView.set('table');
      return;
    }

    if (chartType === 'PIE' || chartType === 'DONUT') {
      this.pieOptions.set(buildPieOptions(model));
      this.barLineOptions.set(null);
    } else if (chartType === 'LINE') {
      this.barLineOptions.set(buildLineOptions(model));
      this.pieOptions.set(null);
    } else if (chartType === 'BAR') {
      this.barLineOptions.set(buildBarOptions(model));
      this.pieOptions.set(null);
    } else {
      this.barLineOptions.set(null);
      this.pieOptions.set(null);
      this.activeView.set('table');
    }
  }
}
