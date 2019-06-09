const { Transform } = require("stream");
const puppeteer = require("puppeteer");
const ShopApi = require("./shop-api");

/**
 * Provides an abstraction on top of Transform that allows for running transforms in parallel until
 * the max parallel is reached.
 */
class ParallelTransform extends Transform {
  constructor(options) {
    const transformFn = options.transform;
    delete options.transform;
    super(options);

    if (transformFn) {
      this._parallelTransform = transformFn;
    }

    this.activeCount = 0;
    this.maxParallel = options.maxParallel || 1
  }

  async _parallelTransform(chunk, encoding) {
  }

  async _transform(chunk, encoding, callback) {
    this.activeCount++;
    const atMax = this.activeCount > this.maxParallel;
    if (!atMax) {
      callback();
    }
    await this._parallelTransform(chunk, encoding, () => {});
    if (atMax) {
      callback();
    }
    this.activeCount--;
  }

  /**
   * After receiving an end event, wait until active processes finish before propagating end to consumers
   */
  async end() {
    while (this.activeCount > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    super.end();
  }
}

/**
 * Receives a record with a vendor and product title, searches for its image, and outputs an updated record
 */
class BrowserStream extends ParallelTransform {
  constructor(options) {
    super({ ...options, objectMode: true, maxParallel: 10, highWaterMark: 10 });
    this.initialized = false;
    this.pageArray = [];
    this.browserPromise = puppeteer.launch();
  }

  async _parallelTransform(chunk, encoding) {
    let page = this.pageArray.pop();
    if (!page) {
      const browser = await this.browserPromise;
      page = await browser.newPage();
    }
    const { Vendor, Title } = chunk;
    const result = await ShopApi.getProductImage(page, Vendor, Title);
    console.log({ Vendor, Title, ...result });
    this.push({ ...chunk, ...result });
    this.pageArray.push(page);
  }

  async end() {
    await super.end();
    const browser = await this.browserPromise();
    await browser.close();
  }
}

module.exports = { BrowserStream };