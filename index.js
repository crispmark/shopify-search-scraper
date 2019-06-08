const parse = require("csv-parse")
const fs = require("fs");
const util = require("util");
fs.readFileAsync = util.promisify(fs.readFile);
fs.writeFileAsync = util.promisify(fs.writeFile);
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const shopConfig = require("./shop-config");

let browser;

async function loadHtml(url) {
  const page = await browser.newPage();
  await page.goto(url);
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  await page.close();
  return bodyHTML;
}

function parseSearch(config, rawHTML) {
  const $ = cheerio.load(rawHTML);
  let urlSuffix = $(config.searchPath).attr(config.searchAttr);
  if (!urlSuffix) {
    throw new Error("no result");
  }
  urlSuffix = urlSuffix.split(" ").pop();
  return urlSuffix[0] === "/" ? config.domain + urlSuffix : urlSuffix;
}

function parseProductPage(config, rawHTML) {
  const $ = cheerio.load(rawHTML);
  const url = $(config.productPath).attr(config.productAttr);
  if (!url) {
    throw new Error("no result");
  }
  return /^\/\//.test(url) ? "https:" + url : url;
}

async function getProductImage(vendor, product) {
  let searchUrl, productUrl, productImage;
  try {
    const config = shopConfig[vendor];
    if (!config) {
      throw new Error("unknown vendor: " + vendor)
    }
    searchUrl = config.searchUrl(product);
    const bodyHTML = await loadHtml(searchUrl);
    productUrl = parseSearch(config, bodyHTML);
    const productHTML = await loadHtml(productUrl);
    productImage = parseProductPage(config, productHTML);
  } catch (err) {
    console.error(err.message);
  }
  return { searchUrl, productUrl, productImage };
}

async function fetchRecord(record) {
  const product = record[1];
  const vendor = record[3].toLowerCase().replace(/\s/ig, "");
  try {
    const { searchUrl, productUrl, productImage } = await getProductImage(vendor, product);
    return [vendor, product, searchUrl, productUrl, productImage];
  } catch (err) {
    console.log(err.message);
    return [vendor, product]
  }
}

function fetchRecords(records) {
  return Promise.all(records.map(fetchRecord));
}

async function batchRecordFetch(records) {
  const output = [["vendor", "product", "searchUrl", "productUrl", "productImage"]];
  const batchSize = 10;
  for (let i = 0; i < records.length; i += batchSize) {
    output.push(...(await fetchRecords(records.slice(i, i + batchSize))))
  }
  return output;
}

function parseAsync(input, options) {
  return new Promise((resolve, reject) => {
    let index = 0;
    const output = [];
    parse(input, options)
      .on("readable", async function () {
        let record
        while (record = this.read()) {
          if (index > 0) {
            output.push(record);
          }
          index++;
        }
        resolve(output);
      })
      .on("error", reject);
  })
}
async function main() {
  browser = await puppeteer.launch();
  const inputCsvFile = process.argv[2];
  const outputCsvFile = process.argv[3];
  const fileData = (await fs.readFileAsync(inputCsvFile)).toString();
  const data = await parseAsync(fileData, { trim: true, skip_empty_lines: true });
  const fetchedData = await batchRecordFetch(data);
  await browser.close();
  const datacsv = fetchedData.map(row => row.join("\t")).join("\n");
  await fs.writeFileAsync(outputCsvFile, datacsv);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });