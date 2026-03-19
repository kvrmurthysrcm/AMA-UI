# Software Installation and Configuration Guide

## Required Software
1. Node.js 20.x LTS or later
2. npm 10.x or later
3. Angular CLI 18.x
4. Git
5. Java 21 (for backend services)
6. PostgreSQL (for Analytics Service)

## 1. Install Node.js and npm
Download and install from the official Node.js website.
After installation, verify:
```bash
node -v
npm -v
```

## 2. Install Angular CLI
```bash
npm install -g @angular/cli@18
```
Verify:
```bash
ng version
```

## 3. Install Git
Install Git and verify:
```bash
git --version
```

## 4. Backend prerequisites
Make sure the following are working before running the UI:
- Agent Service on port 8083
- MCP Tools Service on port 8082
- Analytics Service on port 8081
- PostgreSQL started and reachable by Analytics

## 5. CORS or Proxy Setup
If browser calls to port 8083 fail due to CORS:
- either enable CORS in Agent Service for `http://localhost:4200`
- or use the Angular proxy configuration in `proxy.conf.json`

## 6. Recommended IDE
- VS Code with Angular Language Service
- IntelliJ IDEA Ultimate with Angular plugin


## Angular 18 dependency note
This project is pinned to `ng-apexcharts` `1.8.0` for Angular 18 compatibility. Do not upgrade to `ng-apexcharts` `1.15.0` unless you also upgrade the Angular app to v19.
