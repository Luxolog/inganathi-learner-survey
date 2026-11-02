const SHEET_NAME = 'Survey Responses';
const SPREADSHEET_NAME = 'Inganathi Learner Survey Responses';
const NOTIFICATION_EMAIL = 'info@uvanofinserv.co.za';
const HEADERS = ['Timestamp','Full name','Mobile number','Email','Area','Age group','Employment status','Work sector','Company name','Job/recruitment interest',"Learner's licence status","Driver's licence status",'Licence for work','Support needed','Referral source','Consent'];

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
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
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
    if (!data.fullName || !data.phone || !data.area || !data.consent) {
      throw new Error('Missing required fields');
    }
    const id = PropertiesService.getScriptProperties().getProperty('SURVEY_SPREADSHEET_ID');
    if (!id) throw new Error('Run setupInganathiSurvey() before deploying the web app.');
    const spreadsheet = SpreadsheetApp.openById(id);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Survey responses sheet is missing. Run setupInganathiSurvey().');

    const timestamp = new Date();
    sheet.appendRow([
      timestamp, data.fullName, data.phone, data.email || '', data.area,
      data.ageGroup || '', data.employmentStatus || '', data.workSector || '',
      data.companyName || '', data.workInterest || '', data.learnerStatus || '',
      data.driverStatus || '', data.licenceUse || '', data.supportNeed || '',
      data.referralSource || '', data.consent ? 'Yes' : 'No'
    ]);

    const subject = 'New Inganathi Learner Survey response';
    const body = [
      'A new response has been submitted to the Inganathi Learner Survey.',
      '',
      'Name: ' + data.fullName,
      'Mobile: ' + data.phone,
      'Email: ' + (data.email || 'Not provided'),
      'Area: ' + data.area,
      'Age group: ' + (data.ageGroup || 'Not provided'),
      'Employment: ' + (data.employmentStatus || 'Not provided'),
      'Work sector: ' + (data.workSector || 'Not applicable'),
      'Company: ' + (data.companyName || 'Not provided'),
      'Interested in job opportunities: ' + (data.workInterest || 'Not provided'),
      "Learner's licence: " + (data.learnerStatus || 'Not provided'),
      "Driver's licence: " + (data.driverStatus || 'Not provided'),
      'Licence for work: ' + (data.licenceUse || 'Not applicable'),
      'Support needed: ' + (data.supportNeed || 'Not provided'),
      'Survey source: ' + (data.referralSource || 'Not provided'),
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
