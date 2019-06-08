const { Transform } = require("stream");
const ShopApi = require("./shop-api");

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
    await this._parallelTransform(chunk, encoding);
    if (atMax) {
      callback();
    }
    this.activeCount--;
  }

  async end() {
    while (this.activeCount > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    super.end();
  }
}

class BrowserStream extends ParallelTransform {
  constructor(options) {
    super({ ...options, objectMode: true, maxParallel: 10, highWaterMark: 10 });
    this.initialized = false;
    this.pageArray = [];
    this.browser = browser;
  }

  async _parallelTransform(chunk, encoding) {
    let page = this.pageArray.pop();
    if (!page) {
      page = await this.browser.newPage();
    }
    const { Vendor: vendor, Title: product } = chunk;
    const result = await ShopApi.fetchRecord(page, { vendor, product });
    console.log(result);
    this.push(result.join("\t") + "\n");
    this.pageArray.push(page);
  }
}

module.exports = { BrowserStream };