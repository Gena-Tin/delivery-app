const YOUR_SPREADSHEET_ID = "1aSJ0GFYkQxgyd41WE9NpqqPo0d4aY2sDsPYtD06DFnI"; // ID Google Таблицы

function doGet(e) {
  if (e.parameter.sheet) {
    return getDataFromSheet(e.parameter.sheet);
  } else if (e.parameter.sheets) {
    return getSheetNames();
  } else {
    const response = ContentService.createTextOutput(
      "Добро пожаловать в Google Apps Script API"
    );
    response.setMimeType(ContentService.MimeType.JSON);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Max-Age", "3600");
    return response;
  }
}

function getSheetNames() {
  const ss = SpreadsheetApp.openById(YOUR_SPREADSHEET_ID);
  const sheets = ss.getSheets();
  const sheetNames = sheets.map((sheet) => sheet.getName());

  const response = ContentService.createTextOutput(JSON.stringify(sheetNames));
  response.setMimeType(ContentService.MimeType.JSON);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Max-Age", "3600");
  return response;
}

function getDataFromSheet(sheetName) {
  const ss = SpreadsheetApp.openById(YOUR_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const jsonData = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    jsonData.push(obj);
  }

  const response = ContentService.createTextOutput(JSON.stringify(jsonData));
  response.setMimeType(ContentService.MimeType.JSON);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Max-Age", "3600");
  return response;
}
