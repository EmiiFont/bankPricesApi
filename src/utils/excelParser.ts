import * as XLSX from "xlsx";

export function readDownloadedExcel(filename) {
  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const headers = {};
  const data: any = [];
  for (const z in worksheet) {
    if (z[0] === "!") continue;
    // parse out the column, row, and value
    let tt = 0;
    for (let i = 0; i < z.length; i++) {
      if (!isNaN(parseInt(z[0]))) {
        tt = i;
        break;
      }
    }
    const col = z.substring(0, tt);
    const row = parseInt(z.substring(tt));
    const value = worksheet[z].v;

    // store header names
    if (row == 3 && value) {
      headers[col] = value;
      continue;
    }

    if (!data[row]) {
      data[row] = {};
    }
    data[row][headers[col]] = value;
  }
  // drop those first two rows which are empty
  data.shift();
  data.shift();
  return data;
}
