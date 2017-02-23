/**
 * Created by adi on 07/01/2017.
 */
/**
 * A product (PDF) may have many brands (PDFBaron, PDFToolkit)
 * Brands is a collection of Brand
 */

'use strict';

import BrandSpec from './brandSpec';
import requests from '../dataAccess/requests';

const BrandsSpec = (function() {
  const pList = [];
  const pIndexByUrl = {};

  class BrandsSpec {
    constructor() {
    }

    * [Symbol.iterator]() {
      for (const brand of pList) {
        yield brand;
      }
    }

    getBrandByUrl(url) {
      return pIndexByUrl[url];
    }

    initBrands(callback) {
      requests.getBrandsPromise()
        .then((brands) => {
          brands.map((brandJson) => {
            const brandSpec = new BrandSpec(brandJson);
            pList.push( brandSpec );
            pIndexByUrl[brandJson.url] = brandSpec;
          });
          callback();
        })
        .catch((err) => {
          callback(err);
        });
    }

    printBrands() {
      for (const x of this) {
        console.log(x);
      }
    }
  }

  return BrandsSpec;
})();

//exports = module.exports = BrandsSpec;
export default BrandsSpec;
