var regSheet = 'Registration';
var submissionSheet = "Submissions";
var scriptProp = PropertiesService.getScriptProperties();

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var reg = doc.getSheetByName(regSheet);
    var subm = doc.getSheetByName(submissionSheet);
    var lastRow = reg.getLastRow();

    var foundRecord = false;
    var foundEmail = false;
    for(var i=1; i <= lastRow; i++){
      if (reg.getRange(i, 2).getValue() == e.parameter.team_name && reg.getRange(i, 11).getValue() == e.parameter.email){
        foundRecord = true;
      }
      if (reg.getRange(i, 11).getValue() == e.parameter.email){
        foundEmail = true;
      }
    }

    if (foundRecord && e.parameter.func == 'submission'){
      var data = [new Date(), e.parameter.team_name, e.parameter.ppt_link];
      subm.appendRow(data);

      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    else if (e.parameter.func == 'register'){
      var data = [new Date(), e.parameter.team_name	, e.parameter.name_1	, e.parameter.reg_1	, e.parameter.name_2	, e.parameter.reg_2	, e.parameter.name_3	, e.parameter.reg_3	, e.parameter.name_4	, e.parameter.reg_4	, e.parameter.email	, e.parameter.phone];
      
      reg.appendRow(data);
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    else {
      throw(new Exception());
    }

  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock();
  }
}
