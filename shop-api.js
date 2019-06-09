const cheerio = require("cheerio");
const shopConfig = require("./shop-config");

/**
 * Loads, scrapes and returns the html from the provided url using the provided page
 * @param {Page} page a puppeteer page
 * @param {string} url the url to load
 * @returns {Promise<string>}
 */
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

/**
 * Parses a search result page for the URL of the first result and returns it
 * @param {ShopConfig} config The config to be used to parse the page
 * @param {string} rawHTML The raw html to be parsed
 * @returns {string}
 */
function parseSearch(config, rawHTML) {
  const $ = cheerio.load(rawHTML);
  let urlSuffix = $(config.searchPath).attr(config.searchAttr);
  if (!urlSuffix) {
    throw new Error("no result");
  }
  urlSuffix = urlSuffix.split(" ").pop();
  return urlSuffix[0] === "/" ? config.domain + urlSuffix : urlSuffix;
}

/**
 * Parses a product page for the URL of the first image and returns it
 * @param {ShopConfig} config The config to be used to parse the page
 * @param {string} rawHTML The raw html to be parsed
 * @returns {string}
 */
function parseProductPage(config, rawHTML) {
  const $ = cheerio.load(rawHTML);
  const url = $(config.productPath).attr(config.productAttr);
  if (!url) {
    throw new Error("no result");
  }
  return /^\/\//.test(url) ? "https:" + url : url;
}

/**
 * Fetches and returns an image URL 
 * @param {Page} page the puppeteer page to use to load data
 * @param {string} vendor the vendor to be searched
 * @param {string} product the product to search for
 * @returns {Promise<{ searchUrl: string, productUrl: string, productImage: string }>}
 */
async function getProductImage(page, vendor, product) {
  vendor = vendor.toLowerCase().replace(/\s/ig, "");
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

module.exports = {
  getProductImage
}

