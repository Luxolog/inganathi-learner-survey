# Inganathi Learner & Opportunity Survey

A standalone survey project for Inganathi Driving Academy. This repository is intentionally separate from the existing Inganathi K53 project.

## Google Sheets and email setup
1. Sign in to the same Google account used for Inganathi Driving Academy.
2. Open https://script.google.com/ and create a **new standalone Apps Script project** named `Inganathi Learner Survey`. Do not edit the existing `Inganathi K53 Result Emails` project.
3. Replace the new project's editor contents with the complete contents of `Code.gs` from this repository.
4. Select and run `setupInganathiSurvey`. Approve the requested Google permissions. This creates a new spreadsheet named **Inganathi Learner Survey Responses** in that Google account's Drive.
5. Open the execution log and copy the spreadsheet URL. Keep the spreadsheet private; do not publish it to the web.
6. In Apps Script, choose **Deploy → New deployment → Web app**. Set **Execute as: Me**. Set access to **Anyone** so survey respondents can submit without signing in (subject to the Google account's deployment policy). Deploy and authorize.
7. Copy the deployed Web app URL ending in `/exec`.
8. Add that URL to the `endpoint` constant in both `index.html` and `app/src/main/assets/index.html`, replacing the empty string. Commit the change and redeploy/update the Android app.
9. Test one sample submission. Confirm the row appears in the private spreadsheet and an email notification arrives at **info@uvanofinserv.co.za**.

The script appends the response to the spreadsheet first, then attempts the notification email. If email delivery fails, the response remains in the spreadsheet. Email is sent by the Google account that owns/runs the Apps Script and is subject to Google Apps Script mail quotas.

## Android Studio
- Open Android Studio → **File → New → Project from Version Control**.
- Clone `https://github.com/Luxolog/inganathi-learner-survey.git`.
- Open the cloned repository root (the folder containing `settings.gradle.kts`).
- Allow Gradle sync to finish, then run the app on an emulator or Android device.
- The Android app loads its own bundled copy at `app/src/main/assets/index.html`; it does not reference the K53 app.

## Important
The survey frontend and Android wrapper are implemented, but the live Google Sheet connection is not active until the Apps Script is deployed and its `/exec` URL is added to both HTML files. Do not distribute the APK or collect public responses until the test submission succeeds.
