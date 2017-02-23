/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that given a url will return a product object
 */

'use strict';

const ProductSpec = (function() {
  let pBrandSpec = null;
  let pVanillaSpec = null;

  class Product {
    constructor(brandSpec, vanillaSpec) {
      pBrandSpec = brandSpec;
      pVanillaSpec = vanillaSpec;
    }

    get url() { return pBrandSpec.url; }
    get productType() { return pBrandSpec.productType; }
    get title() { return pBrandSpec.title; }
    get prodTemplate() { return pVanillaSpec.prodTemplate; }
    get display() { return pVanillaSpec.webview.display; }
    get height() { return pVanillaSpec.webview.height; }
    get width() { return pVanillaSpec.webview.width; }
    get envTemplate() { return pVanillaSpec.envTemplate; }
    get offline() { return pVanillaSpec.offline; }
  }

  return Product;
})();

//exports = module.exports = ProductSpec;
export default ProductSpec;
