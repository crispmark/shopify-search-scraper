const cheerio = require("cheerio");
const shopConfig = require("./shop-config");

async function loadHtml(page, url) {
  try {
    await page.goto(url);
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    return bodyHTML;
  } catch (err) {
    if (err.message === "Navigation Timeout Exceeded: 30000ms exceeded") {
      console.log("retrying");
      console.log(url);
      return loadHtml(page, url);
    }
    console.error(err.message);
    throw err;
  }
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

async function getProductImage(page, vendor, product) {
  let searchUrl, productUrl, productImage;
  try {
    const config = shopConfig[vendor];
    if (!config) {
      throw new Error("unknown vendor: " + vendor)
    }
    searchUrl = config.searchUrl(product);
    const bodyHTML = await loadHtml(page, searchUrl);
    productUrl = parseSearch(config, bodyHTML);
    const productHTML = await loadHtml(page, productUrl);
    productImage = parseProductPage(config, productHTML);
  } catch (err) {
    // do nothing
  }
  return { searchUrl, productUrl, productImage };
}

async function fetchRecord(page, { product, vendor }) {
  vendor = vendor.toLowerCase().replace(/\s/ig, "");
  try {
    const { searchUrl, productUrl, productImage } = await getProductImage(page, vendor, product);
    return [vendor, product, searchUrl, productUrl, productImage];
  } catch (err) {
    return [vendor, product]
  }
}

module.exports = {
  fetchRecord,
  getProductImage
}

