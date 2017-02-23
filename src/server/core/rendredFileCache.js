/**
 * Author: adico@somoto.net
 * Created on: 28/01/2017.
 *
 * Overview:
 *
 */
'use strict';
import assert from 'assert';

export default (() => {
  /**
   * cache Map object - hold one entry per product indexed by product url
   * global object among all created RenderedFileCache
   * @type {Object}
   */
  const cache = {};

  /**
   * Cache for rendered files for each website
   * The per website cache is applicable due to
   * maintaining the product url & filePath as indexes
   * to the cached file item.
   */
  class RenderedFileCache {
    /**
     * initialize a global cache object
     */
    constructor() {
    }

    /**
     * initialize a cache storage per product
     * @param {Product} product
     */
    init(product) {
      assert(product);
      if( cache.hasOwnProperty(product.url) ) {
        throw new Error(
          '(RenderedFileCache:constructor) duplicate product url in settings');
      }
      // creating the product cache
      cache[product.url] = {};
    }
    /**
     * is cached result exists for current product & filePath
     * @param {Product} product
     * @param {string} filePath
     * @return {boolean}
     */
    exists(product, filePath) {
      const productCache = cache[product.url];
      return productCache.hasOwnProperty(filePath);
    }

    /**
     * get rendered html from product cache
     * @param {Product} product
     * @param {string} filePath
     * @return {string}
     */
    get(product, filePath) {
      const productCache = cache[product.url];
      return productCache[filePath];
    }

    /**
     * set rendered html into the product cache
     * @param {Product} product
     * @param {string} filePath
     * @param {string} html
     */
    set(product, filePath, html) {
      const productCache = cache[product.url];
      productCache[filePath] = html;
    }

    /**
     * prints to the console logs about cache
     * performance from byte consumption
     * to hit performance, gain & ROI
     */
    printCacheStatistics() {
      console.log('Memory Last Set', 'Memory Total:',
        'Memory Avg.', 'Memory Avg. Per App');
    }
  }

  return RenderedFileCache;
})();
