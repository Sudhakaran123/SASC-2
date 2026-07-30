/**
 * SASC Infra Solution — Contact Form → Google Sheet
 * ------------------------------------------------------------------
 * This Apps Script receives contact-form submissions from the website
 * and appends each one as a new row in the bound Google Sheet.
 *
 * Sheet columns (row 1 header, created automatically if missing):
 *   Date & Time | Name | Company | Email | Phone Number | Service Required | Message
 *
 * Deploy this as a Web App (Execute as: Me / Who has access: Anyone),
 * then paste the deployment URL into index.html:
 *     const CONTACT_FORM_ENDPOINT = '...';
 *
 * See README for full step-by-step instructions.
 */

// Optional: name of the tab/sheet to write to. Leave as the first sheet by default.
var SHEET_NAME = 'Contact Submissions';

// Optional shared-secret check. Leave '' to disable.
// If you set a value here, also send the same value from the website payload
// as `token` (you'd add it in index.html). Kept empty for a zero-config setup.
var SHARED_SECRET = '';

function doPost(e) {
  try {
    // Parse the JSON body sent by the website.
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // Optional security check.
    if (SHARED_SECRET && data.token !== SHARED_SECRET) {
      return json_({ result: 'error', message: 'Unauthorized' });
    }

    var sheet = getSheet_();
    ensureHeader_(sheet);

    // Server-side timestamp = reliable & consistent.
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    sheet.appendRow([
      timestamp,
      data.name || '',
      data.company || '',
      data.email || '',
      data.phone || '',
      data.service || '',
      data.message || ''
    ]);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  }
}

// Simple GET so you can confirm the deployment is live in a browser.
function doGet() {
  return json_({ result: 'ok', message: 'SASC contact endpoint is live.' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // Fall back to the first sheet, or create the named one.
    sheet = ss.getSheets()[0] || ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeader_(sheet) {
  var header = ['Date & Time', 'Name', 'Company', 'Email',
                'Phone Number', 'Service Required', 'Message'];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
