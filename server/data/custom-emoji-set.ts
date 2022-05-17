import { GoogleSpreadsheet } from "google-spreadsheet";
import { decryptJSON } from "./crypto";
import { parseRows } from "./emoji-set";

import hash from "./hash.json";

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
    await doc.useServiceAccountAuth(decryptJSON(hash));
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
