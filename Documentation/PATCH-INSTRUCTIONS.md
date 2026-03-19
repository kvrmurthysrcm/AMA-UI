# Angular ApexCharts Fix Patch

This patch restores the standalone Angular component imports and fixes strict ApexCharts typing.

## Files included
- src/app/app.component.ts
- src/app/app.component.html
- src/app/chart-mapper.ts

## How to apply
1. Extract this zip into your AMA-UI project root.
2. Replace files when prompted.
3. Run:

```bash
npm start
```

## What this fixes
- 'apx-chart' is not a known element
- strict template typing for plotOptions / fill / markers / legend / colors
