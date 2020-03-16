const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const vCardsJS = require('vcards-js');
const path = require('path');


const FILE_NAME = process.argv[2];
const FILE_NAME_NO_EXT = path.basename(FILE_NAME, '.csv');
const inputStream = fs.createReadStream(FILE_NAME, 'utf8');

const outputStream = fs.createWriteStream(FILE_NAME_NO_EXT + '.vcf', {flags: 'w'});
 
inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, delimiter: ';' }))
    .on('data', function (row) {

        //create a new vCard
        var vCard = vCardsJS();
        
        //set properties
        vCard.firstName = row[0];
        vCard.workEmail = row[1];
        
        //save to file
        outputStream.write(vCard.getFormattedString());
        //outputStream.write('\n');
    })
    .on('end', function (data) {
        //console.log('No more rows!');

        outputStream.end();
    });