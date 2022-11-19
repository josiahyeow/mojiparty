import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleServiceAccountCredentials } from "../config";

const GOOGLE_SERVICE_ACCOUNT_API_KEY = process.env
  .GOOGLE_SERVICE_ACCOUNT_API_KEY!;

const SPREADSHEET_ID = "1BzqqZPJjaGtr8wEXL-rcgIr5PmyQewiA6TOE0MbglIg";

export function parseRows(rows: any) {
  let emojiSets: any = [];
  rows.forEach(
    ({
      category,
      emojiSet,
      answer,
    }: {
      category: string;
      emojiSet: string;
      answer: string;
    }) => {
      if (category && emojiSet && answer)
        emojiSets.push({ category, emojiSet, answer });
    }
  );
  return emojiSets;
}

async function fetchEmojis() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(
      googleServiceAccountCredentials(GOOGLE_SERVICE_ACCOUNT_API_KEY)
    );
    await doc.loadInfo();

    const SHEET_IDS = {
      general: 1100919438,
      foods: 1919755213,
      movies: 1448404852,
      tv: 1066868128,
      music: 109594337,
      places: 1066745410,
      brands: 1563151545,
      anime: 554060221,
      koreaboo: 556464515,
    };

    const general = parseRows(
      await doc.sheetsById[SHEET_IDS.general].getRows()
    );
    const movies = parseRows(await doc.sheetsById[SHEET_IDS.movies].getRows());
    const tv = parseRows(await doc.sheetsById[SHEET_IDS.tv].getRows());
    const music = parseRows(await doc.sheetsById[SHEET_IDS.music].getRows());
    const places = parseRows(await doc.sheetsById[SHEET_IDS.places].getRows());
    const brands = parseRows(await doc.sheetsById[SHEET_IDS.brands].getRows());
    const anime = parseRows(await doc.sheetsById[SHEET_IDS.anime].getRows());
    const koreaboo = parseRows(
      await doc.sheetsById[SHEET_IDS.koreaboo].getRows()
    );
    const foods = parseRows(await doc.sheetsById[SHEET_IDS.foods].getRows());

    const emojiSets = {
      music,
      general,
      foods,
      movies,
      tv,
      places,
      brands,
      anime,
      koreaboo,
    };

    console.log(
      `Fetched ${
        movies.length +
        tv.length +
        music.length +
        places.length +
        brands.length +
        anime.length +
        koreaboo.length +
        foods.length
      } emoji sets.`
    );

    return emojiSets;
  } catch (e) {
    throw e;
  }
}

export { fetchEmojis };
