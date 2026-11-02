const SHEET_NAME = 'Survey Responses';
const HEADERS = ['Timestamp','Full name','Mobile number','Email','Area','Age group','Employment status','Work sector','Company name','Job/recruitment interest',"Learner's licence status","Driver's licence status",'Licence for work','Support needed','Referral source','Consent'];
function doGet(){return ContentService.createTextOutput(JSON.stringify({ok:true,service:'Inganathi Learner Survey API'})).setMimeType(ContentService.MimeType.JSON);}
function doPost(e){
  try{
    const data=JSON.parse((e.postData&&e.postData.contents)||'{}');
    if(!data.fullName||!data.phone||!data.area||!data.consent)throw new Error('Missing required fields');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    let sheet=ss.getSheetByName(SHEET_NAME);
    if(!sheet){sheet=ss.insertSheet(SHEET_NAME);sheet.appendRow(HEADERS);}
    sheet.appendRow([new Date(),data.fullName,data.phone,data.email||'',data.area,data.ageGroup||'',data.employmentStatus||'',data.workSector||'',data.companyName||'',data.workInterest||'',data.learnerStatus||'',data.driverStatus||'',data.licenceUse||'',data.supportNeed||'',data.referralSource||'',data.consent?'Yes':'No']);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err.message||err)})).setMimeType(ContentService.MimeType.JSON);}
}