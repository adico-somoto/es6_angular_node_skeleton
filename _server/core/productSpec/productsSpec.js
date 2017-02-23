/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that given a url will return a product object
 */

'use strict';

import Product from './productSpec';
import BrandsSpec from './brandsSpec';
import VanillasSpec from './vanillasSpec';

const ProductsSpec = (function() {
  let pProducts = {};

  class Products {
    constructor(brandsSpec, vanillasSpec) {
      for (const brandSpec of brandsSpec) {
        pProducts[brandSpec.url] =
          new Product(
            brandSpec,
            vanillasSpec.getSpecByProduct(brandSpec.productType)
          );
      }
    }

    static initProducts(callback) {
      const vanillasSpec = new VanillasSpec();
      const brandsSpec = new BrandsSpec();
      return brandsSpec.initBrands(function(err){
        if(err) {
          return callback(err);
        }

        callback(null, new Products(brandsSpec,vanillasSpec));
      });
    }

    getProductByUrl(url) {
      return pProducts[url];
    }
  }

  return Products;
})();


//exports = module.exports = ProductsSpec;
export default ProductsSpec;
