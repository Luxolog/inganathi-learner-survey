# Inganathi Learner & Opportunity Survey

A standalone survey project for Inganathi Driving Academy. This repository is intentionally separate from the existing Inganathi K53 project.

## Scope
- Four mobile-friendly steps, designed for a 3–5 minute completion.
- Captures contact, area, age group, employment status and work sector (including retail).
- Company / organisation name is optional.
- Conditional fields: sector appears only for employed or self-employed respondents; driving-licence questions are hidden for respondents who have passed only the learner's test; licence-for-work question appears only for respondents who already hold a driver's licence.
- Consent is required before submission.

## Files
- `index.html`: standalone responsive survey interface.
- `Code.gs`: Google Apps Script endpoint that appends responses to a linked Google Sheet.
- `android-app/`: Android Studio wrapper will be added as a separate Android project.

## Backend setup
1. Create a Google Sheet for survey responses.
2. Open Extensions → Apps Script and paste `Code.gs`.
3. Deploy as a Web app, execute as the account owner, and choose the access level appropriate for your respondents.
4. Copy the deployed Web app URL into the `endpoint` constant in `index.html` (currently blank).
5. Test with a small sample response before public launch.

Do not deploy the public survey until the endpoint has been configured and tested. The survey does not connect to, import from, or modify the existing K53 application or its data.

## Android Studio
The independent Android project is in the repository root:
- Open Android Studio → **File → New → Project from Version Control**.
- Clone `https://github.com/Luxolog/inganathi-learner-survey.git`.
- Open the cloned repository root (the folder containing `settings.gradle.kts`).
- Allow Gradle sync to finish, then run the app on an emulator or Android device.
- The Android app loads its own bundled copy at `app/src/main/assets/index.html`; it does not reference the K53 app.

The current survey front end is a first implementation. Before collecting real responses, configure and test the Google Apps Script deployment URL in both `index.html` and `app/src/main/assets/index.html`. Until then, submissions are not sent to the response spreadsheet and the app is not ready for public distribution.
