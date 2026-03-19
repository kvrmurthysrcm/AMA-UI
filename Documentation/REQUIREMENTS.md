# AMA UI Requirements Document

## Objective
Build a simple Angular user interface for the AMA project that allows users to enter a natural language query, send it to the AMA Agent Service, and display the returned summary, chart, and data table.

## Functional Requirements
1. Display a search bar at the top of the page.
2. Display a Search button beside the search bar.
3. Accept free-text natural language input.
4. On Search, call the Agent Service endpoint:
   - `POST http://localhost:8083/api/agent/v1/query`
5. Send this request shape:
```json
{
  "question": "Show me the top products in the last 30 days",
  "tenantId": 1001,
  "accountIds": [1001],
  "marketplaceCodes": ["IN"]
}
```
6. Show the summary returned by the Agent.
7. Show the selected tool and chart type.
8. Render a chart dynamically based on `chartType`.
9. Show the underlying data rows in a table.
10. Handle loading, empty results, and error states.

## Non-Functional Requirements
- Clean Apple-style design
- White background with blue visual accents
- Responsive layout
- Readable typography
- Reusable Angular structure
- Easy local development setup

## Supported Chart Types for v1
- BAR
- LINE
- PIE / DONUT
- TABLE fallback

## Assumptions
- Authentication is not required for this phase.
- Agent Service runs locally on port 8083.
- CORS is enabled on Agent Service or Angular proxy is used.
- `tenantId`, `accountIds`, and `marketplaceCodes` are fixed defaults for v1.


## Angular 18 dependency note
This project is pinned to `ng-apexcharts` `1.8.0` for Angular 18 compatibility. Do not upgrade to `ng-apexcharts` `1.15.0` unless you also upgrade the Angular app to v19.
