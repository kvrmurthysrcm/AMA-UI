# AMA UI API Contract Notes

## Agent endpoint
`POST /api/agent/v1/query`

## Request example
```json
{
  "question": "Show me the top products in the last 30 days",
  "tenantId": 1001,
  "accountIds": [1001],
  "marketplaceCodes": ["IN"]
}
```

## Response example
```json
{
  "selectedTool": "get_top_products",
  "toolArguments": {},
  "summary": "Top product by revenue was ...",
  "data": {
    "toolName": "get_top_products",
    "endpointPath": "/api/analytics/v1/sales/by-product",
    "statusCode": 200,
    "data": {
      "success": true,
      "data": []
    },
    "meta": {
      "preferredChart": "BAR"
    }
  },
  "chartType": "BAR"
}
```

## UI mapping rules
- `summary` goes to summary card
- `selectedTool` goes to metadata tag
- `chartType` decides graph type
- `data.data.data` is treated as the row collection when present
