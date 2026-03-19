# AMA UI Run Instructions

## 1. Open terminal in the project root
```bash
cd AMA-UI
```

## 2. Install dependencies
```bash
npm install
```

## 3. Start Angular UI
### Option A: direct API calls to Agent Service
Use this when Agent Service already allows CORS for `http://localhost:4200`.
```bash
npm start
```

### Option B: use Angular proxy
Use this when Agent Service does not allow browser CORS yet.
1. Edit `src/environments/environment.ts`
2. Set:
```ts
useProxy: true
```
3. Start with proxy:
```bash
npm run start:proxy
```

## 4. Open the application
```text
http://localhost:4200
```

## 5. Verify backend is running
Make sure these services are already started:
- Agent Service: `http://localhost:8083`
- MCP Tools Service: `http://localhost:8082`
- Analytics Service: `http://localhost:8081`
- PostgreSQL database

## 6. Test sample query
Paste this in the search bar:
```text
Show me the top products in the last 30 days
```

## 7. Build production bundle
```bash
npm run build
```
Generated output:
```text
dist/ama-ui
```


## Angular 18 dependency note
This project is pinned to `ng-apexcharts` `1.8.0` for Angular 18 compatibility. Do not upgrade to `ng-apexcharts` `1.15.0` unless you also upgrade the Angular app to v19.
