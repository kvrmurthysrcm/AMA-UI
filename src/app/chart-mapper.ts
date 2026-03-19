import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';
import { AgentQueryResponse } from './models';

export interface ChartViewModel {
  labels: string[];
  points: number[];
  metricLabel: string;
  metricKey: string;
}

export interface BarLineOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  markers: ApexMarkers;
  legend: ApexLegend;
  colors: string[];
}

export interface PieOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  colors: string[];
}

const BLUE_PALETTE = ['#0A84FF', '#5AC8FA', '#64D2FF', '#4C9EEB', '#8E8E93'];
const CANDIDATE_LABEL_KEYS = ['productName', 'brandName', 'categoryName', 'name', 'label', 'date', 'period', 'x'];
const CANDIDATE_METRIC_KEYS = ['netSales', 'sales', 'value', 'unitsSold', 'orders', 'amount', 'count', 'y'];

export function extractRows(response: AgentQueryResponse): Record<string, unknown>[] {
  const level1 = response.data?.data as Record<string, unknown> | undefined;
  const level2 = (level1?.['data'] ?? level1) as unknown;

  if (Array.isArray(level2)) {
    return level2 as Record<string, unknown>[];
  }

  if (level2 && typeof level2 === 'object') {
    const nested = (level2 as Record<string, unknown>)['data'];
    if (Array.isArray(nested)) {
      return nested as Record<string, unknown>[];
    }
  }

  return [];
}

export function getDisplayRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.slice(0, 10);
}

export function detectChartModel(response: AgentQueryResponse): ChartViewModel {
  const rows = getDisplayRows(extractRows(response));
  if (!rows.length) {
    return { labels: [], points: [], metricLabel: 'Value', metricKey: 'value' };
  }

  const first = rows[0];
  const labelKey = CANDIDATE_LABEL_KEYS.find((key) => typeof first[key] === 'string') ?? Object.keys(first)[0] ?? 'label';
  const metricKey = CANDIDATE_METRIC_KEYS.find((key) => typeof first[key] === 'number')
    ?? Object.keys(first).find((key) => typeof first[key] === 'number')
    ?? 'value';

  const labels = rows.map((row, index) => String(row[labelKey] ?? `Item ${index + 1}`));
  const points = rows.map((row) => Number(row[metricKey] ?? 0));

  return {
    labels,
    points,
    metricLabel: toTitle(metricKey),
    metricKey
  };
}

export function buildBarOptions(model: ChartViewModel): BarLineOptions {
  return {
    series: [{ name: model.metricLabel, data: model.points }],
    chart: { type: 'bar', height: 420, toolbar: { show: false }, foreColor: '#1D3557' },
    xaxis: {
      categories: model.labels,
      labels: { rotate: -35, trim: true, style: { colors: '#34577A', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: '#34577A' } }, title: { text: model.metricLabel } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1.5, colors: ['transparent'] },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '48%' } },
    tooltip: { y: { formatter: (value) => formatNumber(value) } },
    fill: { opacity: 1 },
    markers: { size: 0 },
    legend: { show: true, position: 'top', labels: { colors: '#34577A' } },
    colors: [BLUE_PALETTE[0]]
  };
}

export function buildLineOptions(model: ChartViewModel): BarLineOptions {
  return {
    series: [{ name: model.metricLabel, data: model.points }],
    chart: { type: 'line', height: 420, toolbar: { show: false }, foreColor: '#1D3557', zoom: { enabled: false } },
    xaxis: {
      categories: model.labels,
      labels: { style: { colors: '#34577A', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: '#34577A' } }, title: { text: model.metricLabel } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    tooltip: { y: { formatter: (value) => formatNumber(value) } },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '48%' } },
    fill: { opacity: 1 },
    markers: { size: 5 },
    legend: { show: true, position: 'top', labels: { colors: '#34577A' } },
    colors: [BLUE_PALETTE[1]]
  };
}

export function buildPieOptions(model: ChartViewModel): PieOptions {
  return {
    series: model.points,
    chart: { type: 'donut', height: 420, foreColor: '#1D3557' },
    labels: model.labels,
    legend: { position: 'bottom', fontSize: '13px', labels: { colors: '#34577A' } },
    tooltip: { y: { formatter: (value) => formatNumber(value) } },
    responsive: [{ breakpoint: 768, options: { chart: { height: 360 }, legend: { position: 'bottom' } } }],
    colors: BLUE_PALETTE
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
}

function toTitle(value: string): string {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (v) => v.toUpperCase())
    .trim();
}
