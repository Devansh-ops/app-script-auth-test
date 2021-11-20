var credSheet = 'Credentials';
var responseSheet = "Responses";
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
    var cred = doc.getSheetByName(credSheet);
    var resp = doc.getSheetByName(responseSheet);
    var email = e.parameter.email;
    var password = e.parameter.password;

    var lastRow = cred.getLastRow();
    var foundRecord = false;
    for(var i=1; i <= lastRow; i++){
      if (cred.getRange(i, 1).getValue() == email && cred.getRange(i, 2).getValue() == password){
        foundRecord = true;
      }
    }

    if (foundRecord){
      if (e.parameter.func == 'response'){
        var data = [new Date(), e.parameter.email, e.parameter.response];
        resp.appendRow(data);
      }
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    else {
      if (e.parameter.func == 'register'){
        var data = [email, password];
        cred.appendRow(data);
      }
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
        .setMimeType(ContentService.MimeType.JSON)
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
