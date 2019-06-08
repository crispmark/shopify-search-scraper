const parse = require("csv-parse")
const fs = require("fs");
const puppeteer = require("puppeteer");
const { pipeline } = require("stream");
const { BrowserStream } = require("./streams");

async function main() {
  const start = Date.now();
  browser = await puppeteer.launch();
  const inputCsvFile = process.argv[2];
  const outputCsvFile = process.argv[3];
  const readStream = fs.createReadStream(inputCsvFile);
  const csvStream = parse({ trim: true, skip_empty_lines: true, columns: true });
  const browserStream = new BrowserStream({ browser, emitClose: false });
  const writeStream = fs.createWriteStream(outputCsvFile);
  pipeline(readStream, csvStream, browserStream, writeStream)
    .on("finish", () => {
      console.log(`finished in ${(Date.now() - start) / 1000}s`);
      process.exit(0);
    });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });