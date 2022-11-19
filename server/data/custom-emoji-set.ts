import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleServiceAccountCredentials } from "../config";
import { parseRows } from "./emoji-set";

const GOOGLE_SERVICE_ACCOUNT_API_KEY = process.env
  .GOOGLE_SERVICE_ACCOUNT_API_KEY!;

const SPREADSHEET_ID = "1MiLw-zRq-Vc7d26BkB7l6YKIpYAZdCYKaJ13l_lAhUk";

export function parseIndexRows(rows: any) {
  let communityEmojiSets: any = [];
  rows.forEach(
    ({
      category,
      author,
      sheetId,
    }: {
      category: string;
      author: string;
      sheetId: string;
    }) => {
      if (category && author && sheetId)
        communityEmojiSets.push({ category, author, sheetId });
    }
  );
  return communityEmojiSets;
}

async function fetchCustomEmojis() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(
      googleServiceAccountCredentials(GOOGLE_SERVICE_ACCOUNT_API_KEY)
    );
    await doc.loadInfo();

    const index = parseIndexRows(await doc.sheetsByIndex[0].getRows());

    const hariRaya = parseRows(
      await doc.sheetsById[index[0].sheetId].getRows()
    );

    return {
      hariRaya,
    };
  } catch (e) {
    throw e;
  }
}

export { fetchCustomEmojis };

fetchCustomEmojis();
