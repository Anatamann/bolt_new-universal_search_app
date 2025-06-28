# APK Build Guide - Universal Search Application

## Overview

This guide provides step-by-step instructions to build an APK binary for the Universal Search application. The app is built with Expo and React Native, so we'll cover both Expo Application Services (EAS) and local build methods.

## Prerequisites

Before starting, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** installed globally
- **Android Studio** (for local builds)
- **Java Development Kit (JDK)** version 17
- **Git** for version control

## Method 1: EAS Build (Recommended)

EAS (Expo Application Services) is the easiest and most reliable way to build your app.

### Step 1: Install EAS CLI

```bash
npm install -g @expo/eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account, create one at [expo.dev](https://expo.dev).

### Step 3: Configure EAS Build

Initialize EAS in your project:

```bash
eas build:configure
```

This creates an `eas.json` file in your project root. Update it with the following configuration:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 4: Update App Configuration

Ensure your `app.json` has the proper Android configuration:

```json
{
  "expo": {
    "name": "Universal Search",
    "slug": "universal-search-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.universalsearch",
      "versionCode": 1
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": ["expo-router", "expo-font", "expo-web-browser"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Step 5: Build APK

For a preview/testing APK:

```bash
eas build --platform android --profile preview
```

For a production-ready AAB (Android App Bundle):

```bash
eas build --platform android --profile production
```

### Step 6: Download Your Build

Once the build completes:

1. Visit [expo.dev/accounts/[username]/projects/[project-slug]/builds](https://expo.dev)
2. Find your completed build
3. Download the APK/AAB file

## Method 2: Local Build with Expo

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Prebuild for Android

```bash
npx expo prebuild --platform android
```

This generates the native Android project in the `android/` directory.

### Step 3: Install Android Dependencies

Navigate to the android directory and install dependencies:

```bash
cd android
./gradlew clean
cd ..
```

### Step 4: Build APK Locally

```bash
npx expo run:android --variant release
```

Or build directly with Gradle:

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Method 3: Manual Android Studio Build

### Step 1: Generate Native Code

```bash
npx expo prebuild --platform android
```

### Step 2: Open in Android Studio

1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to your project's `android/` directory
4. Click "OK"

### Step 3: Configure Build

1. In Android Studio, go to **Build** → **Generate Signed Bundle / APK**
2. Select **APK** and click **Next**
3. Create a new keystore or use an existing one:
   - **Key store path**: Choose location for new keystore
   - **Password**: Create a secure password
   - **Key alias**: Enter an alias (e.g., "universal-search-key")
   - **Key password**: Create a key password
   - Fill in certificate information

### Step 4: Build Configuration

1. Select **release** build variant
2. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**
3. Click **Finish**

### Step 5: Locate Your APK

The signed APK will be generated at:
```
android/app/release/app-release.apk
```

## Build Optimization

### Reduce APK Size

Add these optimizations to your `app.json`:

```json
{
  "expo": {
    "android": {
      "enableProguardInReleaseBuilds": true,
      "enableSeparateBuildPerCPUArchitecture": true
    }
  }
}
```

### Environment Variables

For production builds, create a `.env.production` file:

```env
EXPO_PUBLIC_API_URL=https://your-production-api.com
EXPO_PUBLIC_ENVIRONMENT=production
```

## Testing Your APK

### Install on Device

1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Install via ADB:

```bash
adb install path/to/your/app-release.apk
```

### Test Installation

1. Transfer APK to your device
2. Enable **Install from Unknown Sources**
3. Tap the APK file to install

## Troubleshooting

### Common Issues

**Build Fails with Memory Error:**
```bash
export NODE_OPTIONS="--max-old-space-size=8192"
eas build --platform android --profile preview
```

**Gradle Build Fails:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

**Metro Bundle Error:**
```bash
npx expo start --clear
```

**Dependencies Issues:**
```bash
rm -rf node_modules
npm install
```

### Build Logs

For EAS builds, check logs at:
- [expo.dev/accounts/[username]/projects/[project-slug]/builds](https://expo.dev)

For local builds, check:
```bash
npx expo run:android --verbose
```

## Distribution

### Internal Testing

1. Upload APK to Google Drive or similar
2. Share download link with testers
3. Provide installation instructions

### Google Play Store

1. Build AAB (Android App Bundle):
   ```bash
   eas build --platform android --profile production
   ```

2. Upload to Google Play Console
3. Follow Play Store review process

### Alternative App Stores

- **Amazon Appstore**: Accepts APK files
- **Samsung Galaxy Store**: Requires registration
- **F-Droid**: For open-source apps

## Security Considerations

### Keystore Management

- **Backup your keystore**: Store securely and create backups
- **Use strong passwords**: Both keystore and key passwords
- **Version control**: Never commit keystores to Git

### Code Obfuscation

Enable ProGuard for release builds:

```json
{
  "expo": {
    "android": {
      "enableProguardInReleaseBuilds": true
    }
  }
}
```

## Automation

### GitHub Actions

Create `.github/workflows/build-android.yml`:

```yaml
name: Build Android APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: npm install
        
      - name: Build APK
        run: eas build --platform android --profile preview --non-interactive
```

## Final Checklist

Before distributing your APK:

- [ ] Test on multiple Android devices
- [ ] Verify all features work offline
- [ ] Check app permissions are appropriate
- [ ] Test search functionality across all endpoints
- [ ] Verify data persistence (favorites, history)
- [ ] Test theme switching (light/dark mode)
- [ ] Ensure proper error handling
- [ ] Validate app icon and splash screen
- [ ] Test app performance and memory usage
- [ ] Verify AsyncStorage functionality

## Support

For additional help:

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **EAS Build Docs**: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **Android Developer Guide**: [developer.android.com](https://developer.android.com)
- **React Native Docs**: [reactnative.dev](https://reactnative.dev)

---

This guide should help you successfully build and distribute your Universal Search application as an APK binary. Choose the method that best fits your development workflow and distribution needs.