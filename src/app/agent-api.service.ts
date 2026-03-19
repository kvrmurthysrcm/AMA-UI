import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentQueryRequest, AgentQueryResponse } from './models';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgentApiService {
  private readonly http = inject(HttpClient);

  query(request: AgentQueryRequest): Observable<AgentQueryResponse> {
    const baseUrl = environment.useProxy ? '' : environment.agentApiBaseUrl;
    return this.http.post<AgentQueryResponse>(`${baseUrl}/api/agent/v1/query`, request);
  }
}
