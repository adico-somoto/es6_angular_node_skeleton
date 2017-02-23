/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that
 * given a url will return a product object
 */

'use strict';

import Product from './productSpec';
import brandsSpecMod from './brandsSpec';
import VanillasSpec from './vanillasSpec';

export default ((app) => {
  const BrandsSpec = brandsSpecMod(app);
  let pProducts = {};

  /**
   * List of products with indexed fetch by url
   */
  class Products {
    /**
     * init the list generation
     * @param {BrandsSpec} brandsSpec
     * @param {VanillasSpec} vanillasSpec
     */
    constructor(brandsSpec, vanillasSpec) {
      // create map of products indexed by the site URL
      for (const brandSpec of brandsSpec) {
        pProducts[brandSpec.url] =
          new Product(
            brandSpec,
            vanillasSpec.getSpecByProduct(brandSpec.productType)
          );
      }
    }

    * [Symbol.iterator]() {
      for (const key of Object.keys(pProducts)) {
        yield key;
      }
    }

    getProductByUrl(productUrl) {
      return pProducts[productUrl];
    }

    /**
     * NOTE: although the constructor is public,
     * TODO: make the constructor private, is possible?
     * use this static function to create the products
     * @param {Function} callback
     * @return {boolean} true
     */
    static initProducts(callback) {
      const vanillasSpec = new VanillasSpec();
      const brandsSpec = new BrandsSpec();
      brandsSpec.initBrands(function(err) {
        if(err) {
          return callback(err);
        }

        console.log('(core:productsSpec) brandsSpec,vanillasSpec:');
        console.dir(brandsSpec);
        console.dir(vanillasSpec);
        callback(null, new Products(brandsSpec, vanillasSpec));
      });
      return true;
    }

    /**
     * get product spec by sites url
     * @param {string} url
     * @return {Product}
     */
    getProductByUrl(url) {
      return pProducts[url];
    }
  }

  return Products;
});
