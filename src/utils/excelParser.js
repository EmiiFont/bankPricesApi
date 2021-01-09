const fs = require('fs');
const https = require('https');
var XLSX = require('xlsx');


function readDownloadedExcel(filename){
    var workbook = XLSX.readFile(filename);
    var sheet_name_list = workbook.SheetNames[0];
    let data2 = [];
        var worksheet = workbook.Sheets[sheet_name_list];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names
            if(row == 3 && value) {
                headers[col] = value;
                continue;
            }

            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        data2 = data;
    return data2;
}


module.exports.readDownloadedExcel = readDownloadedExcel;