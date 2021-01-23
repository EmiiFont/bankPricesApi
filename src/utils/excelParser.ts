import * as XLSX from 'xlsx';

export function readDownloadedExcel(filename) {
  const workbook = XLSX.readFile(filename);
  const sheet_name_list = workbook.SheetNames[0];
  let data2: any[];
  const worksheet = workbook.Sheets[sheet_name_list];
  const headers = {};
  const data: any = [];
  for (let z in worksheet) {
    if (z[0] === '!') continue;
    //parse out the column, row, and value
    let tt = 0;
    for (let i = 0; i < z.length; i++) {
      if (!isNaN(parseInt(z[0]))) {
        tt = i;
        break;
      }
    }
    var col = z.substring(0, tt);
    var row = parseInt(z.substring(tt));
    var value = worksheet[z].v;

    //store header names
    if (row == 3 && value) {
      headers[col] = value;
      continue;
    }

    if (!data[row]) {
      data[row] = {};
    }
    data[row][headers[col]] = value;
  }
  //drop those first two rows which are empty
  data.shift();
  data.shift();
  data2 = data;
  return data2;
}
