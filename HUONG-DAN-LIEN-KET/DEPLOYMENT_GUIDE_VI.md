# 🚀 Deployment Guide - Web/App/Chatbot

**Hướng Dẫn Triển Khai Ứng Dụng Kết Nối Backend**  
**Ngôn Ngữ:** Tiếng Việt  
**Trạng Thái:** ✅ Hoàn thành

---

## 📋 MỤC LỤC

1. [Frontend Deployment](#frontend-deployment)
2. [Mobile App Deployment](#mobile-app-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Environment Setup](#environment-setup)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Logging](#monitoring--logging)
7. [Troubleshooting](#troubleshooting)

---

## 🌐 Frontend Deployment

### Next.js/React App

#### Bước 1: Build Ứng Dụng

```bash
# Cài dependencies
npm install

# Build production
npm run build

# Test build locally
npm run start
```

#### Bước 2: Tối Ưu hóa Environment

```bash
# .env.production
REACT_APP_FIREBASE_API_KEY=AIzaSyClxGvAQLxX0ZIHIstEeHM8GzONkFcw9RM
REACT_APP_FIREBASE_AUTH_DOMAIN=ivs-159a7.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ivs-159a7
REACT_APP_FIREBASE_STORAGE_BUCKET=ivs-159a7.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
REACT_APP_API_BASE=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api
NODE_ENV=production
```

#### Bước 3: Deploy Các Platform

**Firebase Hosting:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy --only hosting
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**AWS S3 + CloudFront:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### Bước 4: Kiểm Tra Deployment

```bash
# Test health endpoint
curl https://your-app-url.com/api/health

# Check performance
# Lighthouse: https://pagespeed.web.dev/
```

---

## 📱 Mobile App Deployment

### Flutter App

#### Bước 1: Android Release

```bash
# Build APK
flutter build apk --release

# Build App Bundle (recommended for Play Store)
flutter build appbundle --release
```

**Output:**
- APK: `build/app/outputs/apk/release/app-release.apk`
- AAB: `build/app/outputs/bundle/release/app-release.aab`

#### Bước 2: iOS Release

```bash
# Build IPA
flutter build ios --release

# Archive và Export
cd ios
xcodebuild -workspace Runner.xcworkspace \
  -scheme Runner \
  -configuration Release \
  -archivePath build/Runner.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath build/Runner.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/ios/ipa
```

#### Bước 3: Play Store Deployment

```bash
# 1. Prepare signing key
keytool -genkey -v -keystore ~/key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias key

# 2. Update android/app/build.gradle
signingConfigs {
  release {
    keyAlias 'key'
    keyPassword 'password'
    storeFile file('../../key.jks')
    storePassword 'password'
  }
}

# 3. Upload to Play Store
#    - Go to: https://play.google.com/console/
#    - Create app
#    - Upload build/app/outputs/bundle/release/app-release.aab
```

#### Bước 4: App Store Deployment

```bash
# 1. Create App ID in Apple Developer
# 2. Create App in App Store Connect
# 3. Upload IPA via Transporter

# Download Transporter
# Or use Xcode:
# Xcode → Window → Organizer → Distribute App
```

### React Native App

```bash
# Build APK
cd android && ./gradlew assembleRelease
cd ..

# Build IPA
cd ios && xcodebuild -scheme [App Name] -configuration Release -archivePath [App Name].xcarchive archive
cd ..
```

---

## ⚙️ Backend Deployment

### Firebase App Hosting

Backend đã được deploy tại:
```
https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app
```

#### Kiểm Tra Deployment Status

```bash
# Login to Firebase
firebase login

# List deployments
firebase apps:list

# Check logs
firebase functions:log --follow
```

#### Update Backend

```bash
# 1. Pull latest code
git pull origin main

# 2. Build locally
npm run build

# 3. Deploy
firebase deploy --only hosting

# 4. Verify
curl https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api/health
```

---

## 🔧 Environment Setup

### Production Variables

#### Frontend (.env.production)
```bash
# Firebase Config
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Backend
REACT_APP_API_BASE=https://backend-studio-ivssever--ivs-159a7.us-east4.hosted.app/api

# App
REACT_APP_APP_NAME=IVS English Learners
REACT_APP_APP_VERSION=1.0.0
NODE_ENV=production
```

#### Backend (apphosting.yaml)
```yaml
env:
  - key: NODE_ENV
    value: production
  - key: FIREBASE_SERVICE_ACCOUNT_KEY
    value: '{"type":"service_account",...}'
  - key: GEMINI_API_KEY
    value: your_gemini_key
  - key: OPENAI_API_KEY
    value: your_openai_key
  # ... other keys
```

#### Mobile (Android: strings.xml, iOS: Info.plist)
```xml
<!-- android/app/src/main/res/values/strings.xml -->
<resources>
    <string name="default_web_client_id">your_client_id</string>
    <string name="firebase_database_url">your_db_url</string>
</resources>
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Frontend)

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          # ... other secrets
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "Frontend deployment: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Frontend Deployment*\nStatus: ${{ job.status }}\nCommit: ${{ github.sha }}"
                  }
                }
              ]
            }
```

### GitHub Actions (Backend)

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'apphosting.yaml'
      - 'package.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy with Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## 📊 Monitoring & Logging

### Firebase Console Monitoring

```bash
# View real-time logs
firebase functions:log --follow

# Export logs
firebase functions:log > logs.txt
```

### Application Performance Monitoring

```typescript
// src/lib/monitoring.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const logApiCall = (endpoint: string, duration: number) => {
  logEvent(analytics, 'api_call', {
    endpoint,
    duration,
    timestamp: new Date().toISOString(),
  });
};

export const logError = (error: string, context: any) => {
  logEvent(analytics, 'error', {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
};
```

### Sentry Integration (Error Tracking)

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

export default Sentry;
```

---

## ❌ Troubleshooting

### Frontend Issues

**Problem: API calls failing in production**
```
Giải pháp:
1. Kiểm tra CORS settings
2. Verify API URL đúng
3. Check Firebase keys
```

**Problem: Firebase auth not working**
```
Giải pháp:
1. Enable auth methods in Firebase Console
2. Add app to Firebase project
3. Verify authorized domains
```

### Backend Issues

**Problem: 500 errors after deployment**
```
Giải pháp:
1. Check Firebase logs: firebase functions:log
2. Verify environment variables
3. Test health endpoint
```

**Problem: Slow API responses**
```
Giải pháp:
1. Optimize Firestore queries
2. Add caching layer
3. Scale App Hosting instances
```

### Mobile Issues

**Problem: App crashes on startup**
```
Giải pháp:
1. Check Firebase initialization
2. Verify API connectivity
3. Review crash logs: Firebase Crashlytics
```

---

## ✅ Pre-Deployment Checklist

### Frontend
- [ ] All dependencies updated
- [ ] Environment variables set
- [ ] Build passes without errors
- [ ] No console warnings/errors
- [ ] API endpoints tested
- [ ] Mobile responsive
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Security scan passed

### Backend
- [ ] Dependencies updated
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Health endpoint working
- [ ] All AI models configured
- [ ] Firebase initialized
- [ ] Error handling correct
- [ ] Rate limiting configured

### General
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan ready
- [ ] Monitoring setup
- [ ] Backup created

---

## 📞 Support

**Issues?**
- Check logs: `firebase functions:log`
- Review error messages
- Check network connectivity
- Verify API keys
- Contact support team

---

**Happy Deploying! 🎉**
