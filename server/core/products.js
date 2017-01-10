/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that given a url will return a product object
 * that consists of configuration for the requested product.
 *
 * Because each request requires a product object,
 * - the object properties better be defined on the prototype level.
 * - the inner logic should be cached on the server lifecycle & provided to the request,
 *   to reuse same objects between requests. We can't trust the module to cache it for us.
 *
 * TODO: The current file will be splitted into multiple classes files later
 *
 * We have 3 entities involved in a product specification
 * 1) product which consists of 2) vanilla product specification & 3) brand specification
 * Product is the parent, the container that groups the composite specifications of vanilla & brand
 */

'use strict';

function createProduct() {
  return {
    type: 'jelly',
    colour: 'red',
    scoops: 3
  };
}

class Products {
  constructor(hostname) {
    this.hostname = hostname;
  }

}

class WebView {
  constructor(display, width, height) {
    this.display = display;
    this.width = width;
    this.height = height;
  }
}

class VanillaSpec {
  constructor(productTemplate, webview, envTemplate, offline) {
    this.prodTemplate = productTemplate;
    this.webview = webview;
    this.envTemplate = envTemplate;
    this.offline = offline || false;
  }
}

class Brand {
  constructor() {

  }
}

class Product {
  constructor(vanillaSpec, brandSpec) {
    this.vanillaSpec = vanillaSpec;
    this.brandSpec = brandSpec;
  }
}

let vanillaSpecs = null;
let products = null;

const createVanillaSpecs = function() {
  const tVanillaSpecs = {
    pdf: new VanillaSpec('pdf', new WebView('window', 640, 385), 'tab'),
    ziprar: new VanillaSpec('ziprar', new WebView('window', 300, 428), '', true),
    calendar: new VanillaSpec('calendar', new WebView('browser', 0, 0), 'online'),
    motivation: new VanillaSpec('motivation', new WebView('browser', 1024, 768), 'onlinetab'),
    yo: new VanillaSpec('motivation', new WebView('browser', 1024, 768), 'onlinetab'),
    mo: new VanillaSpec('motivation', new WebView('browser', 1024, 768), 'onlinetab'),
  };

  // Storing products in express application variable to maintain the same objects across application
  app.set('vanillaSpecs', tVanillaSpecs);

  return tVanillaSpecs;
};

const urlToVanillaSpecName = {
  'pdfbaron.com': 'pdf',
  'pdftoolkit.com': 'pdf',
  'foxycalendar.com': 'calendar',
  'byoml.com': 'motivation',
  'yo.com': 'yo',
  'mo.com': 'mo',
};

const getBrandByUrl = (url) => {
  const brand = new Brand();
  return brand;
};

const getVanillaSpecNameByUrl = (url) => {
  return urlToVanillaSpecName[url];
};

const getProductByUrl = (url) => {
  const vanillaSpecName = getVanillaSpecNameByUrl(url);
  const brandSpecName = getBrandSpecByUrl(url);
  return vanillaSpecs[vanillaSpecName];
};

const getProducts = () => {
  return products;
};

module.exports = {
  getProducts: getProducts,
  getProductByUrl: getProductByUrl
};

exports = module.exports = function(app) {
  // Storing products in express application variable to maintain the same objects across application
  // Using the stored value if available of creating a new products objects
  const tVanillaSpecs = app.get('vanillaSpecs');
  if(!vanillaSpecs) {
    if (tVanillaSpecs) {
      vanillaSpecs = tVanillaSpecs;
    } else {
      vanillaSpecs = createVanillaSpecs();
    }
  }

  return {
    getProducts: getProducts,
    getProductByUrl: getProductByUrl
  };
};
