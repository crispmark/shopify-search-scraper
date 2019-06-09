const csvParse = require("csv-parse");
const csvStringify = require("csv-stringify");
const fs = require("fs");
const { pipeline } = require("stream");
const { BrowserStream } = require("./streams");

function pipelineAsync(...streams) {
  return new Promise((resolve, reject) => {
    pipeline(...streams, (err) => err ? reject(err) : resolve());
  })
}

async function main() {
  const start = Date.now();
  const inputCsvFile = process.argv[2];
  const outputCsvFile = process.argv[3];
  const readStream = fs.createReadStream(inputCsvFile);
  const csvInStream = csvParse({ trim: true, skip_empty_lines: true, columns: true });
  const csvOutStream = csvStringify({ header: true, delimiter: "\t" });
  const browserStream = new BrowserStream({ emitClose: false });
  const writeStream = fs.createWriteStream(outputCsvFile);
  await pipelineAsync(readStream, csvInStream, browserStream, csvOutStream, writeStream);
  console.log(`finished in ${(Date.now() - start) / 1000}s`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });