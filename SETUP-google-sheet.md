# Contact Form → Google Sheet: Setup Guide

This connects the **Send Us a Message** form on the Contact page to a Google Sheet.
Every submission is added as a new row, and the visitor sees a success message.

Company email for sharing the sheet: **sascinfrasolutions@gmail.com**

---

## What you'll do (5–10 minutes)

1. Create a Google Sheet.
2. Add the Apps Script and deploy it as a Web App.
3. Paste the Web App URL into `index.html`.
4. Test.

---

## Step 1 — Create the Google Sheet

1. Sign in to Google with **sascinfrasolutions@gmail.com** (so the sheet is owned by the company account).
2. Go to https://sheets.google.com → **Blank spreadsheet**.
3. Rename it, e.g. **SASC Website Enquiries**.
4. Rename the first tab (bottom-left) to **Contact Submissions**.
   - You don't have to add the header row by hand — the script creates it automatically on the first submission:
     `Date & Time | Name | Company | Email | Phone Number | Service Required | Message`

> Because the sheet is created **inside** the company account, it is already owned by
> `sascinfrasolutions@gmail.com`. No separate "share" step is needed. If you build it
> under a different account instead, click **Share** → add `sascinfrasolutions@gmail.com`
> as **Editor**.

---

## Step 2 — Add and deploy the Apps Script

1. In that same sheet: **Extensions → Apps Script**.
2. Delete any starter code, then paste the entire contents of **`google-apps-script.gs`**.
3. Click the **Save** (disk) icon.
4. Click **Deploy → New deployment**.
   - Click the gear ⚙ next to "Select type" → choose **Web app**.
   - **Description:** anything, e.g. `SASC contact form`.
   - **Execute as:** **Me** (`sascinfrasolutions@gmail.com`).
   - **Who has access:** **Anyone**.
     *(This is required so the public website can post to it. Only your posted data is
     accepted — no one can read the sheet through this URL.)*
   - Click **Deploy**.
5. Google will ask you to **authorize** the first time:
   - Click **Authorize access** → choose the company account → **Advanced** →
     **Go to (project name) (unsafe)** → **Allow**.
     *(This "unsafe" warning is normal for your own private scripts.)*
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy........./exec`

> Quick check: paste that URL into a browser. You should see
> `{"result":"ok","message":"SASC contact endpoint is live."}`

---

## Step 3 — Connect the website

1. Open **`index.html`** in a text editor.
2. Find this line (near the contact-form JavaScript):
   ```js
   const CONTACT_FORM_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder with your Web app URL from Step 2:
   ```js
   const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfy.........../exec';
   ```
4. Save and re-upload `index.html` to your host (e.g. GitHub Pages).

---

## Step 4 — Test

1. Open the live site → **Contact** page.
2. Fill in the form and click **Send Message**.
3. You should see: *"Thank you! Your message has been sent successfully…"*
4. Open the Google Sheet — a new row should appear with the timestamp and details.

---

## How to change the sheet or company email later

**Point the form at a different sheet**
1. Create/open the new sheet → **Extensions → Apps Script** → paste `google-apps-script.gs`.
2. **Deploy → New deployment** → Web app (same settings as above) → copy the new URL.
3. In `index.html`, update `CONTACT_FORM_ENDPOINT` with the new URL. Re-upload.

**Change which account owns / receives the data**
- Simplest: build the sheet + script under the new Google account and repeat Steps 1–3.
- Or keep the existing sheet and just **Share** it (**Share** button, top-right) with the
  new email as **Editor**. Data still lands in the same sheet; the new person can view it.

**Get an email alert on every submission (optional)**
- In the Apps Script, inside `doPost`, after `sheet.appendRow(...)`, add:
  ```js
  MailApp.sendEmail('sascinfrasolutions@gmail.com',
    'New website enquiry from ' + (data.name || 'visitor'),
    'Email: ' + data.email + '\nPhone: ' + data.phone +
    '\nService: ' + data.service + '\n\n' + data.message);
  ```
- Save, then **Deploy → Manage deployments → Edit → Version: New version → Deploy**
  (re-deploy so the change goes live). The URL stays the same.

---

## Notes on security & reliability

- The Web App runs as your account and only ever **appends** rows — the public URL cannot
  read or edit existing data.
- The site sends the data as a plain-text JSON body, which avoids browser CORS preflight
  issues with Apps Script, so submissions are reliable across browsers.
- A copy of each submission is also kept in the site's local Admin panel
  (`/#admin`, code `sasc-admin`) as a backup view on the device where it was submitted.
- If you ever set `SHARED_SECRET` in the script, you must also send the same value as
  `token` in the website payload — leave it blank for the simplest working setup.
- **Important:** after editing the script, always re-deploy (**Manage deployments → Edit →
  New version**) or your changes won't take effect on the live URL.
