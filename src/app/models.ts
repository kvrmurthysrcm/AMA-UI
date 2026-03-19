export interface AgentQueryRequest {
  question: string;
  tenantId: number;
  accountIds: number[];
  marketplaceCodes: string[];
}

export interface AgentQueryResponse {
  selectedTool: string;
  toolArguments: Record<string, unknown>;
  summary: string;
  data: ToolExecutionPayload;
  chartType: string;
}

export interface ToolExecutionPayload {
  toolName?: string;
  endpointPath?: string;
  statusCode?: number;
  data?: AnalyticsEnvelope | Record<string, unknown> | unknown;
  meta?: Record<string, unknown>;
}

export interface AnalyticsEnvelope {
  success?: boolean;
  message?: string;
  traceId?: string;
  timestamp?: string;
  data?: unknown;
  meta?: Record<string, unknown>;
}

export interface SummaryChip {
  label: string;
  query: string;
}

export interface ChartDatum {
  label: string;
  value: number;
}
