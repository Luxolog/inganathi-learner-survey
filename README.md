# Inganathi Learner Survey

A standalone learner-intake survey and Android app for Inganathi Driving Academy. This repository and app are completely separate from the existing Inganathi K53 project.

## Branding and questionnaire
- Uses Inganathi red, black and white branding with the U mark.
- The Android launcher icon uses the same U identity.
- Student / learner responses reveal institution type and institution name.
- Employed and self-employed responses reveal the relevant work or business sector; company / business name remains optional.
- Other employment situations reveal a short explanation field.
- Licence questions branch according to the respondent's current licensing stage.
- The survey asks about the respondent's reason for obtaining a licence, and shows extra work- or business-specific follow-ups only when relevant.
- No job / recruitment-opportunity question is included.
- Respondents under 18 are asked for parent / guardian details and permission.
- After submission, a thank-you screen appears and returns to the first screen automatically.

## Google Sheets and email setup
1. Sign in to the Google account used for the separate Inganathi Learner Survey Apps Script project.
2. Open https://script.google.com/ and open the **Inganathi Learner Survey** project. Do not edit the existing **Inganathi K53 Result Emails** project.
3. Replace the Apps Script editor contents with the complete latest contents of `Code.gs` from this repository, then save.
4. Run `setupInganathiSurvey()` once and approve permissions. It updates the survey response headings while preserving existing response data.
5. In Apps Script, choose **Deploy → Manage deployments**, edit the existing web app deployment, select **New version**, and deploy. Keep **Execute as: Me** and access set to **Anyone** if allowed by the account's deployment policy.
6. The deployed web app URL should remain the URL configured in both survey HTML files. If Google gives you a different `/exec` URL, update both `index.html` and `app/src/main/assets/index.html` to match.
7. Submit a test response. Confirm that it appears in the private **Inganathi Learner Survey Responses** spreadsheet and that an email notification arrives at **info@uvanofinserv.co.za**.

The script saves the response to the spreadsheet before attempting to send the notification email. If email delivery fails, the response remains in the spreadsheet. Email is sent by the Google account that owns the Apps Script and is subject to Google Apps Script mail quotas.

## Android Studio
- Open the repository root (the folder containing `settings.gradle.kts`) in Android Studio.
- Sync Gradle after pulling the latest repository changes.
- The Android app loads its own bundled copy from `app/src/main/assets/index.html`; it does not reference or modify the K53 app.
- Current app version: **1.0.2** (versionCode 3).
- The launcher icon is defined in `app/src/main/res/drawable/ic_launcher.xml`.

## Before distributing
Do not distribute the APK or collect public responses until a test submission has been confirmed in Google Sheets and the notification email has been checked.
