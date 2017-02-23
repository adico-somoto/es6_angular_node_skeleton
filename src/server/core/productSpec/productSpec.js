/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that, given a url,
 * will return a matching product object
 * The product object merges BrandsSpec & VanillaSpec into a 3rd file
*/

'use strict';

const ProductSpec = (function() {
  // let pBrandSpec = null;
  // let pVanillaSpec = null;

  const propBrandSpec = Symbol();
  const propVanillaSpec = Symbol();
  /**
   * Product spec is the brand processing specification on a vanilla template
   */
  class Product {
    /**
     * initialize product with injected specs
     * @param {BrandSpec} brandSpec
     * @param {VanillaSpec} vanillaSpec
     */
    constructor(brandSpec, vanillaSpec) {
      this[propBrandSpec] = brandSpec;
      this[propVanillaSpec] = vanillaSpec;
    }

    /**
     * returns this stringified
     * @return {string}
     */
    toString() {
      return JSON.stringify(this);
    }
    /**
     * returns the brand url
     * @return {string}
     */
    get url() {
      return this[propBrandSpec].url;
    }
    /**
     * returns the brand product type
     * @return {String}
     */
    get productType() {
      return this[propBrandSpec].productType;
    }
    /**
     * returns the brand title
     * @return {string}
     */
    get title() {
      return this[propBrandSpec].title;
    }
    /**
     * returns the prodTemplate name identifier
     * @return {string}
     */
    get prodTemplate() {
      return this[propVanillaSpec].prodTemplate;
    }
    /**
     * returns if the webview should display (true|false)
     * @return {string}
     */
    get display() {
      return this[propVanillaSpec].webview.display;
    }
    /**
     * returns the height of the webview window
     * @return {number}
     */
    get height() {
      return this[propVanillaSpec].webview.height;
    }
    /**
     * returns the width of the webview window
     * @return {number}
     */
    get width() {
      return this[propVanillaSpec].webview.width;
    }
    /**
     * returns the environment template name identifier
     * @return {string}
     */
    get envTemplate() {
      return this[propVanillaSpec].envTemplate;
    }
    /**
     * returns if the product is type offline
     * @return {boolean}
     */
    get offline() {
      return this[propVanillaSpec].offline;
    }
  }

  return Product;
})();

export default ProductSpec;
