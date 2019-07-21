const querystring = require("querystring");

function basicSearch(product) {
  return this.domain + "/search?" + querystring.stringify({ q: product })
}

function productSearch(product) {
  return this.domain + "/search?" + querystring.stringify({ q: product, type: "product" });
}

function ptypeSearch(product) {
  return this.domain + "/search?" + querystring.stringify({ search_query: product, ptype: "Product" });
}

function rootSearch(product) {
  return this.domain + "?" + querystring.stringify({ s: product });
}

const variant1 = {
  searchUrl: basicSearch,
  searchPath: ".search-results :first-child",
  searchAttr: "data-url",
  productPath: ".ProductItem-gallery-slides :first-child img",
  productAttr: "data-src"
}

const variant2 = {
  searchUrl: basicSearch,
  searchPath: ".grid-uniform :first-child a",
  searchAttr: "href",
  productPath: ".product-single img",
  productAttr: "data-mfp-src"
}

const variant3 = {
  searchUrl: productSearch,
  searchPath: ".products :first-child a",
  searchAttr: "href",
  productPath: ".slides :first-child a",
  productAttr: "href"
}

const variant4 = {
  searchUrl: basicSearch,
  searchPath: ".grid :first-child a",
  searchAttr: "href",
  productPath: ".slick-track img",
  productAttr: "src"
}

/**
 * A shop config
 * @typedef {Object} ShopConfig
 * @property {function} searchUrl The function to generate a search url from a product name
 * @property {string} searchPath A css selector pointing to the first search result
 * @property {string} searchAttr The attribute of html element containing the search result product page URL
 * @property {string} productPath A css selector pointing to the main product image
 * @property {string} productAttr The attribute of html element containing main image source url
 */

module.exports = {
  "2halfmoon": {
    domain: "https://www.2halfmoon.com",
    ...variant1
  },
  "7115": {
    domain: "https://7115newyork.com",
    searchUrl: basicSearch,
    searchPath: ".row.results a",
    searchAttr: "href",
    productPath: ".photo.active",
    productAttr: "href"
  },
  // "abaca": {
  //   domain: "https://www.abacastore.com",
  //   ...variant1
  // },
  "agentnateur": {
    domain: "https://www.agentnateur.com",
    searchUrl: basicSearch,
    searchPath: ".results :first-child a",
    searchAttr: "href",
    productPath: ".product-images img",
    productAttr: "src"
  },
  "ajaiealaie": {
    domain: "https://www.ajaiealaie.com",
    ...variant3
  },
  "aliyawanek": {
    domain: "https://www.aliyawanek.com",
    ...variant1
  },
  "atelierdelphine": {
    domain: "https://atelierdelphine.com",
    searchUrl: basicSearch,
    searchPath: ".products-grid :first-child a",
    searchAttr: "href",
    productPath: ".product .row a",
    productAttr: "href"
  },
  "aydry": {
    domain: "https://www.aydry.com",
    searchUrl: basicSearch,
    searchPath: ".list-view-items :first-child",
    searchAttr: "href",
    productPath: ".product-single-photos a",
    productAttr: "href"
  },
  "beatonlinen": {
    domain: "https://beatonlinen.com",
    ...variant2
  },
  "cadette": {
    domain: "http://www.cadettehandmade.com",
    ...variant1
  },
  "carleen": {
    domain: "http://www.carleen.us",
    ...variant1
  },
  "diarte": {
    domain: "https://www.diarte.net",
    ...variant1,
    productPath: "#flowItems .flow-item img",
    productAttr: "data-src"
  },
  "esby": {
    domain: "https://www.esbyapparel.com",
    searchUrl: productSearch,
    searchPath: "#product-loop :first-child a",
    searchAttr: "href",
    productPath: "#product-photos img",
    productAttr: "src"
  },
  // "evegravel": {
  //   domain: "https://www.esbyapparel.com",
  //   searchUrl: productSearch,
  //   searchPath: "#product-loop :first-child a",
  //   searchAttr: "href",
  //   productPath: "#product-photos img",
  //   productAttr: "src"
  // },
  "firstrite": {
    domain: "https://firstriteclothing.com",
    searchUrl: basicSearch,
    searchPath: ".search-results-products :first-child a",
    searchAttr: "href",
    productPath: ".product-main-image img",
    productAttr: "src"
  },
  "foureyes": {
    domain: "https://www.foureyesceramics.com",
    searchUrl: basicSearch,
    searchPath: ".search-results :first-child",
    searchAttr: "data-url",
    productPath: ".productitem-images :first-child img",
    productAttr: "data-image"
  },
  "grouppartner": {
    domain: "https://group-partner.com",
    ...variant2
  },
  "happyfrenchgang": {
    domain: "https://happyfrenchgang.myshopify.com",
    searchUrl: productSearch,
    searchPath: ".list-view-items :first-child",
    searchAttr: "href",
    productPath: ".product-single__photo :nth-child(2)",
    productAttr: "src"
  },
  "hdh": {
    domain: "https://hackwithdesignhouse.com",
    searchUrl: ptypeSearch,
    searchPath: ".products :first-child a",
    searchAttr: "href",
    productPath: ".slick-track :first-child img",
    productAttr: "src"
  },
  "heinui": {
    domain: "https://heinui.com",
    ...variant1
  },
  // "helenlevi": {
  //   domain: "https://helenlevi.com",
  //   searchUrl: basicSearch,
  //   searchPath: ".products :first-child a",
  //   searchAttr: "href",
  //   productPath: ".slick-track :first-child img",
  //   productAttr: "src"
  // },
  "hemleva": {
    domain: "https://www.hemleva.com",
    ...variant1
  },
  "iiivvvyyy": {
    domain: "http://www.ivyivyivy.com",
    ...variant1,
    productPath: "#productSlideshow :first-child img",
  },
  // "juniperridge": {
  //   domain: "https://juniperridge.com",
  //   ...variant1
  // },
  // "justfemale": {
  //   domain: "https://justfemale.com/",
  //   ...variant1
  // }
  "jennylemons": {
    domain: "http://www.jennylemons.com",
    ...variant1
  },
  "kordal": {
    domain: "https://kordalstudio.com",
    searchUrl: basicSearch,
    searchPath: "#shopify-section-search-template .columns :first-child .alpha a",
    searchAttr: "href",
    productPath: ".slides :first-child img",
    productAttr: "src"
  },
  "lacausa": {
    domain: "https://www.lacausaclothing.com",
    searchUrl: basicSearch,
    searchPath: "#bc-sf-filter-products :first-child a",
    searchAttr: "href",
    productPath: ".slides :first-child a",
    productAttr: "href"
  },
  "laurenwinter": {
    domain: "https://laurenwinter.co",
    ...variant1
  },
  // "liamofyork": {
  //   domain: "http://www.liamofyork.com",
  //   ...variant1,
  //   productPath: "#slideshow :first-child img",
  //   productAttr: "data-src"
  // }
  // "lebonshoppe": {
  //   domain: "https://lebonshoppe.com",
  //   searchUrl: basicSearch,
  //   searchPath: ".list-view-items a",
  //   searchAttr: "href",
  //   productPath: ".product-single-photos a",
  //   productAttr: "href"
  // },
  "loup": {
    domain: "https://louponline.com",
    searchUrl: basicSearch,
    searchPath: ".list-products :first-child a",
    searchAttr: "href",
    productPath: ".product__slide :first-child",
    productAttr: "src"
  },
  "littleseedfarm": {
    domain: "https://littleseedfarm.com",
    ...variant4
  },
  "machete": {
    domain: "https://shopmachete.com",
    searchUrl: basicSearch,
    searchPath: ".results :first-child a",
    searchAttr: "href",
    productPath: ".product-main-image img",
    productAttr: "src"
  },
  "marymacgill": {
    domain: "https://www.marymacgill.com",
    ...variant1
  },
  "mayabrenner": {
    domain: "https://www.mayabrenner.com",
    searchUrl: productSearch,
    searchPath: "#search-results :first-child a",
    searchAttr: "href",
    productPath: ".product-main-image img",
    productAttr: "src"
  },
  "micaelagreg": {
    domain: "https://www.micaelagreg.com",
    ...variant4
  },
  "minna": {
    domain: "https://www.minna-goods.com",
    searchUrl: basicSearch,
    searchPath: ".search-results-products :first-child a",
    searchAttr: "href",
    productPath: ".product-image img",
    productAttr: "src"
  },
  "nataliebusby": {
    domain: "https://nataliebusby.com",
    ...variant3
  },
  "nico": {
    domain: "https://niconicoclothing.com",
    ...variant4
  },
  "olioeosso": {
    domain: "https://www.olioeosso.com",
    searchUrl: productSearch,
    searchPath: ".search-results :first-child a",
    searchAttr: "href",
    productPath: ".product-background img",
    productAttr: "src"
  },
  "oy-l": {
    domain: "https://oy-l.com",
    searchUrl: rootSearch,
    searchPath: "#content div :first-child a",
    searchAttr: "href",
    productPath: ".images :first-child img",
    productAttr: "src"
  },
  // "palomawool": {
  //   domain: "https://oy-l.com",
  //   searchUrl: rootSearch,
  //   searchPath: "#content div :first-child a",
  //   searchAttr: "href",
  //   productPath: ".images :first-child img",
  //   productAttr: "src"
  // },
  "plante": {
    domain: "http://www.planteclothing.com",
    ...variant1
  },
  // "ritarow": {
  //   domain: "https://www.ritarow.com",
  //   ...variant1
  // },
  "scarfshop": {
    domain: "http://www.scarf-shop.com",
    ...variant1,
    productPath: "#flowItems .flow-item img",
    productAttr: "data-src"
  },
  "seekcollective": {
    domain: "https://www.seekcollective.com",
    searchUrl: basicSearch,
    searchPath: ".ProductList :first-child a",
    searchAttr: "href",
    productPath: ".Product__Slideshow :first-child img",
    productAttr: "data-original-src"
  },
  "shanaluther": {
    domain: "https://shanaluther.com",
    searchUrl: rootSearch,
    searchPath: "main article a",
    searchAttr: "href",
    productPath: ".single-product-main-image img",
    productAttr: "src"
  },
  // "sideparty": {
  //   domain: "https://shanaluther.com",
  //   searchUrl: rootSearch,
  //   searchPath: "main article a",
  //   searchAttr: "href",
  //   productPath: ".single-product-main-image img",
  //   productAttr: "src"
  // },
  "slownorth": {
    domain: "https://www.slownorth.com",
    ...variant4,
    productPath: "#ProductPhoto img",
    productAttr: "src"
  },
  "sophiemonet": {
    domain: "https://www.sophiemonetjewelry.com",
    ...variant1,
      productPath: "#productSlideshow img",
      productAttr: "src"
  },
  "sugarcandy": {
    domain: "https://sugarcandymtn.com",
    ...variant2,
    productAttr: "src"
  },
  "takara": {
    domain: "https://shoptakara.com",
    ...variant2
  },
  "ursaminor": {
    domain: "https://ursaminorstudio.com",
    ...variant4
  },
  // TODO:
  "vereverto": {
    domain: "https://www.vereverto.com",
    searchUrl: productSearch,
    searchPath: ".product-grid--root :first-child a",
    searchAttr: "href",
    productPath: ".product-page--image img",
    productAttr: "srcset"
  },
  "voloshin": {
    domain: "https://voloshin.us",
    ...variant2,
    productPath: ".active-magic-slide a",
    productAttr: "href"
  },
  "winsomegoods": {
    domain: "http://www.winsomegoods.com",
    ...variant1,
    productPath: "#flowItems .flow-item img",
    productAttr: "data-src"
  },
  "wolfcircus": {
    domain: "https://www.wolfcircus.com",
    ...variant4
  },
  "woodlot": {
    domain: "https://shopwoodlot.com",
    searchUrl: productSearch,
    searchPath: ".grid-uniform .grid__item a",
    searchAttr: "href",
    productPath: ".slick-list :first-child img",
    productAttr: "src"
  },
  "wray": {
    domain: "https://wray.nyc",
    searchUrl: basicSearch,
    searchPath: ".ProductList :first-child a",
    searchAttr: "href",
    productPath: ".Product__Slideshow img",
    productAttr: "src"
  }
}