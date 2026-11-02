const SHEET_NAME = 'Survey Responses';
const SPREADSHEET_NAME = 'Inganathi Learner Survey Responses';
const NOTIFICATION_EMAIL = 'info@uvanofinserv.co.za';

const HEADERS = [
  'Timestamp', 'Full name', 'Mobile number', 'Email', 'Area', 'Age group',
  'Employment status', 'Institution type', 'Institution name', 'Work sector',
  'Job title', 'Company name', "Learner's licence status", "Driver's licence status",
  'Licence interested in', 'Licence for work', 'Start timeframe', 'Learner test date',
  'Practical driving lessons status', 'Expired learner licence support',
  'Main reason for licence', 'Support needed', 'Preferred contact method',
  'Referral source', 'Parent / guardian name', 'Parent / guardian mobile',
  'Parent / guardian permission', 'Consent'
];

function setupInganathiSurvey() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('SURVEY_SPREADSHEET_ID');
  let spreadsheet;
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    props.setProperty('SURVEY_SPREADSHEET_ID', spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.getSheets()[0].setName(SHEET_NAME);

  // Preserve existing responses by matching old column headings to the new schema.
  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  let oldHeaders = [];
  let oldRows = [];
  if (lastRow > 0) {
    oldHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    if (lastRow > 1) oldRows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  }
  const headerIndex = {};
  oldHeaders.forEach((header, index) => {
    if (header) headerIndex[String(header)] = index;
  });
  const migratedRows = oldRows.map(row => HEADERS.map(header => {
    const index = headerIndex[header];
    return index === undefined ? '' : row[index];
  }));

  if (lastRow > 0) {
    sheet.getRange(1, 1, lastRow, Math.max(lastCol, HEADERS.length)).clearContent();
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  if (migratedRows.length) {
    sheet.getRange(2, 1, migratedRows.length, HEADERS.length).setValues(migratedRows);
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#080a12').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, HEADERS.length);

  Logger.log('Survey spreadsheet: ' + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    service: 'Inganathi Learner Survey API',
    configured: !!PropertiesService.getScriptProperties().getProperty('SURVEY_SPREADSHEET_ID')
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (!data.fullName || !data.phone || !data.area || !data.ageGroup || !data.employmentStatus || !data.licenceStage || !data.mainReason || !data.supportNeed || !data.contactPreference || !data.consent) {
      throw new Error('One or more required survey fields are missing.');
    }
    if (data.ageGroup === 'Under 18' && (!data.guardianName || !data.guardianPhone || !data.guardianConsent)) {
      throw new Error('Parent or guardian permission is required for respondents under 18.');
    }

    const id = PropertiesService.getScriptProperties().getProperty('SURVEY_SPREADSHEET_ID');
    if (!id) throw new Error('Run setupInganathiSurvey() before deploying the web app.');
    const spreadsheet = SpreadsheetApp.openById(id);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Survey responses sheet is missing. Run setupInganathiSurvey().');

    const timestamp = new Date();
    const row = [
      timestamp,
      data.fullName,
      data.phone,
      data.email || '',
      data.area,
      data.ageGroup,
      data.employmentStatus,
      data.institutionType || '',
      data.institutionName || '',
      data.workSector || '',
      data.jobTitle || '',
      data.companyName || '',
      data.licenceStage || '',
      data.currentCode || '',
      data.targetCode || '',
      '', // The survey no longer asks whether a licence is needed for work.
      data.timeframe || '',
      data.testDate || '',
      data.practicalStatus || '',
      data.expiredSupport || '',
      data.mainReason || '',
      data.supportNeed || '',
      data.contactPreference || '',
      data.referralSource || '',
      data.guardianName || '',
      data.guardianPhone || '',
      data.guardianConsent ? 'Yes' : 'No',
      data.consent ? 'Yes' : 'No'
    ];
    sheet.appendRow(row);

    const subject = 'New Inganathi Learner Survey response';
    const body = [
      'A new response has been submitted to the Inganathi Learner Survey.',
      '',
      'Name: ' + data.fullName,
      'Mobile: ' + data.phone,
      'Email: ' + (data.email || 'Not provided'),
      'Area: ' + data.area,
      'Age group: ' + data.ageGroup,
      'Employment situation: ' + data.employmentStatus,
      'Institution type: ' + (data.institutionType || 'Not applicable'),
      'Institution: ' + (data.institutionName || 'Not applicable'),
      'Work / business sector: ' + (data.workSector || 'Not applicable'),
      'Role: ' + (data.jobTitle || 'Not provided'),
      'Company / business: ' + (data.companyName || 'Not provided'),
      'Licensing position: ' + data.licenceStage,
      'Current driver's licence code: ' + (data.currentCode || 'Not applicable'),
      'Target driver's licence code: ' + (data.targetCode || 'Not applicable'),
      'Preferred start timeframe: ' + (data.timeframe || 'Not provided'),
      'Learner test date: ' + (data.testDate || 'Not provided'),
      'Practical lessons: ' + (data.practicalStatus || 'Not applicable'),
      'Expired learner licence support: ' + (data.expiredSupport || 'Not applicable'),
      'Main reason: ' + data.mainReason,
      'Support requested: ' + data.supportNeed,
      'Preferred contact: ' + data.contactPreference,
      'Referral source: ' + (data.referralSource || 'Not provided'),
      'Parent / guardian: ' + (data.guardianName || 'Not applicable'),
      'Parent / guardian mobile: ' + (data.guardianPhone || 'Not applicable'),
      'Parent / guardian permission: ' + (data.guardianConsent ? 'Yes' : 'Not applicable'),
      'Consent: ' + (data.consent ? 'Yes' : 'No'),
      '',
      'Submitted: ' + timestamp.toString(),
      'Spreadsheet: ' + spreadsheet.getUrl()
    ].join('\n');

    let emailSent = false;
    let emailError = '';
    try {
      MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
      emailSent = true;
    } catch (mailError) {
      emailError = String(mailError);
      console.error('Notification email failed: ' + emailError);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true, saved: true, notificationSent: emailSent, notificationError: emailError
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({
      ok: false, error: String(err.message || err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}