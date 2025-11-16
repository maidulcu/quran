# Android Deployment Guide

Complete guide to submit your Al-Quran app to the Google Play Store.

## Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at: https://play.google.com/console/signup

2. **Expo Account** (Free)
   - Sign up at: https://expo.dev/signup

3. **Required Tools**
   - EAS CLI installed: `npm install -g eas-cli`

## Step 1: Prepare App Assets

### App Icon Requirements
- **Size**: 512x512 pixels
- **Format**: PNG (32-bit with alpha)
- **No transparency** in corners

### Feature Graphic (Required)
- **Size**: 1024x500 pixels
- **Format**: JPEG or PNG
- Used as banner in Play Store

### Screenshots (At least 2 required)
- **Phone**: 320-3840 pixels (16:9 or 9:16 ratio)
- **Tablet** (optional): 1200-7680 pixels
- Show actual app UI

### App Description
Prepare the following:
- **Short description** (80 characters max)
- **Full description** (4000 characters max)
- **App category**: Books & Reference
- **Content rating**: Everyone
- **Privacy Policy URL** (required if app collects data)

## Step 2: Build Your App

### 2.1 Login to EAS

```bash
eas login
```

### 2.2 Configure Project

```bash
# This creates eas.json (already created)
eas build:configure
```

### 2.3 Build Production AAB (Android App Bundle)

```bash
# For first-time build
eas build --platform android --profile production

# You'll be prompted to:
# - Generate a new Android keystore (say YES)
# - Expo will manage the keystore for you
```

This process takes 10-20 minutes. When complete, you'll get a download link for your `.aab` file.

### 2.4 Download the AAB

```bash
# The build will provide a download URL
# Or download from: https://expo.dev/accounts/[your-account]/projects/quran/builds
```

## Step 3: Create Google Play Console Listing

### 3.1 Create New App

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill in:
   - **App name**: Al-Quran
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept declarations and click **"Create app"**

### 3.2 Set Up Store Listing

Navigate to **Store presence → Main store listing**:

**App details:**
- **App name**: Al-Quran
- **Short description**:
  ```
  Read the Holy Quran with translations, audio recitations, and offline support
  ```

- **Full description**:
  ```
  Al-Quran is a beautiful mobile application for reading the Holy Quran with comprehensive features:

  ✨ FEATURES:
  • Complete Quran - All 114 Surahs with 6,236 Ayahs
  • 20+ Translations - English, Urdu, French, Spanish, German, Turkish, and more
  • Audio Recitations - Listen to renowned reciters like Mishary Alafasy, Abdul Basit
  • Offline Support - Download Surahs for offline reading
  • Search - Find verses across the entire Quran
  • Bookmarks - Save your favorite verses
  • Dark Mode - Easy on the eyes
  • Adjustable Font - Customize Arabic text size (14-36px)

  📖 PERFECT FOR:
  • Daily Quran reading
  • Memorization (Hifz)
  • Learning with translations
  • Listening to recitations

  🌙 SPECIAL SURAHS:
  Quick access to Al-Fatihah, Ya-Sin, Al-Kahf, and Al-Mulk

  🎨 BEAUTIFUL DESIGN:
  Modern interface with light and dark themes

  📥 OFFLINE MODE:
  Download all Surahs for reading without internet

  Free, no ads, and designed with love for the Muslim community.

  Data provided by Al Quran Cloud API.
  ```

**App icon**: Upload your 512x512 PNG icon

**Feature graphic**: Upload 1024x500 graphic

**Phone screenshots**: Upload at least 2 screenshots

**App category**: Books & Reference

**Tags**: Quran, Islam, Muslim, Holy Quran, Koran

**Contact details**:
- Email (required)
- Website (optional)
- Phone (optional)

### 3.3 Privacy Policy

If your app collects any data, you need a privacy policy URL.

**Simple Privacy Policy Template**:
```
Privacy Policy for Al-Quran App

Last updated: [DATE]

This app does not collect, store, or share any personal information.

Data Storage:
- Bookmarks and reading preferences are stored locally on your device
- No data is transmitted to external servers except when fetching Quran content from Al Quran Cloud API
- We do not collect analytics or tracking data

Third-party Services:
- Al Quran Cloud API (https://alquran.cloud) for Quran text and audio

Contact:
For questions, contact: [YOUR EMAIL]
```

Host this on GitHub Pages or your website, then add the URL to Play Console.

## Step 4: Content Rating

1. Go to **Policy → App content → Content rating**
2. Click **"Start questionnaire"**
3. Fill out the questionnaire:
   - Select your app category
   - Answer questions (all should be "No" for a Quran app)
4. Submit to get your rating (should be "Everyone")

## Step 5: Target Audience and Content

### Set Target Age
1. Go to **Policy → App content → Target audience**
2. Select age groups: **All ages**

### Declare Ads
1. Go to **Policy → App content → Ads**
2. Select **"No, my app does not contain ads"**

### Data Safety
1. Go to **Policy → App content → Data safety**
2. Answer questions about data collection:
   - **Does your app collect or share user data?**: No
   - Complete the form

## Step 6: Select Countries

1. Go to **Production → Countries/regions**
2. Select **"Add countries/regions"**
3. Choose **"Available in all countries"** or select specific countries

## Step 7: Upload Your AAB

1. Go to **Production → Releases → Production**
2. Click **"Create new release"**
3. Upload your `.aab` file
4. Add **Release name**: `1.0.0` (matches your app version)
5. Add **Release notes**:
   ```
   Initial release of Al-Quran app

   Features:
   • Complete Quran with 20+ translations
   • Audio recitations from renowned reciters
   • Offline support for reading without internet
   • Bookmarks and search functionality
   • Beautiful dark mode
   • Adjustable Arabic font size
   ```
6. Click **"Save"**

## Step 8: Review and Publish

### Pre-launch Report
Google will automatically test your app. Wait for the report (takes a few minutes).

### Complete All Required Tasks
Go through the dashboard and complete all items marked with ⚠️ or ❗

### Submit for Review
1. Review everything in the dashboard
2. Click **"Send for review"** in the Production release
3. Wait for Google's review (typically 1-7 days)

## Step 9: Automated Submission (Optional)

For future updates, automate submission with EAS:

### 9.1 Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a service account
3. Download the JSON key file
4. Save as `service-account-key.json` in your project
5. **Add to .gitignore**!

### 9.2 Grant Permissions

1. In Play Console, go to **Setup → API access**
2. Link your Google Cloud project
3. Grant permissions to the service account:
   - Release to production, exclude devices, and use Play App Signing

### 9.3 Submit via EAS

```bash
# Build and submit in one command
eas build --platform android --profile production --auto-submit

# Or submit existing build
eas submit --platform android --latest
```

## Post-Publication

### Monitor Your App
- **Play Console Dashboard**: Track installs, ratings, crashes
- **User Reviews**: Respond to feedback
- **Pre-launch reports**: Fix any issues found

### Update Your App

When you make changes:

```bash
# 1. Update version in app.json
# "version": "1.1.0"

# 2. Build new AAB
eas build --platform android --profile production

# 3. Submit to Play Console
# Upload new AAB to Production → Create new release
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and retry
eas build --platform android --profile production --clear-cache
```

### App Rejected
- Check email from Google Play
- Common issues:
  - Missing privacy policy
  - Content rating not set
  - Screenshots don't match app
  - Crashes during testing

### Keystore Issues
```bash
# View your credentials
eas credentials

# If you lose access, create new one
# WARNING: Creates new signing key
eas build --platform android --profile production --clear-credentials
```

## Useful Commands

```bash
# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Cancel build
eas build:cancel

# View credentials
eas credentials

# Update app on device
eas update

# View project info
eas project:info
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Signing Best Practices](https://developer.android.com/studio/publish/app-signing)

## Important Notes

1. ⚠️ **Never commit** `service-account-key.json` or keystore files to git
2. 📝 **Keep keystore backup** - losing it means you can't update your app
3. 🔄 **Test thoroughly** before each release
4. 📊 **Monitor crash reports** in Play Console
5. ⭐ **Encourage reviews** - better ratings = more downloads

## Quick Checklist

- [ ] Google Play Developer account created ($25)
- [ ] App icon (512x512) prepared
- [ ] Feature graphic (1024x500) prepared
- [ ] Screenshots (at least 2) prepared
- [ ] App description written
- [ ] Privacy policy created (if needed)
- [ ] EAS CLI installed
- [ ] Production AAB built (`eas build`)
- [ ] Store listing completed
- [ ] Content rating obtained
- [ ] Data safety form filled
- [ ] AAB uploaded to Play Console
- [ ] Release notes added
- [ ] App submitted for review

---

Good luck with your app launch! 🚀
