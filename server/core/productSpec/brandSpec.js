/**
 * Created by adi on 07/01/2017.
 */
/**
 * A product (PDF) may have many brands (PDFBaron, PDFToolkit)
 * Brands differs by several attributes which are specified in the following object
 */

'use strict';

const BrandSpec = (function() {
  class BrandSpec {
    constructor(brandSpecJson) {
      this.url = brandSpecJson.url;
      this.productType = brandSpecJson.productType;
      this.title = brandSpecJson.title;
    }
  }

  return BrandSpec;
})();

exports = module.exports = BrandSpec;
