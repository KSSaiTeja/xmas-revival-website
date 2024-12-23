import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { retry } from "./retry";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendToSheet(values: string[][]) {
  return retry(async () => {
    try {
      // First, check if the sheet is empty
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A1:F1",
      });

      if (!response.data.values || response.data.values.length === 0) {
        // If the sheet is empty, add headers
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: "Sheet1!A1:F1",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["Name", "Mobile", "Email", "Offer", "Time", "Date"]],
          },
        });
      }

      // Now append the actual data
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:F",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: values,
        },
      });
      console.log("Data appended successfully");
      return appendResponse;
    } catch (err) {
      console.error("Error appending data to Google Sheets:", err);
      throw err;
    }
  });
}

export async function updateSheet(
  email: string,
  data: { offer: string; time: string; date: string },
) {
  return retry(async () => {
    try {
      // First, find the row with the matching email
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:F",
      });

      const rows = response.data.values;
      if (!rows) throw new Error("No data found in the sheet");

      const rowIndex = rows.findIndex((row) => row[2] === email);
      if (rowIndex === -1) throw new Error("Email not found in the sheet");

      // Update the row with the new data
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Sheet1!D${rowIndex + 1}:F${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[data.offer, data.time, data.date]],
        },
      });

      console.log("Data updated successfully");
    } catch (err) {
      console.error("Error updating data in Google Sheets:", err);
      throw err;
    }
  });
}
