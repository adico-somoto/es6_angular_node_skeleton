/**
 * Author: adico@somoto.net
 * Created on: 29/01/2017.
 *
 * Overview:
 *
 */

'use strict';
import fs from 'fs';

export default (() => {
  const walkSync = (dir, fileList) => {
    let files = fs.readdirSync(dir);

    fileList = fileList || [];
    files.forEach((file) => {
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        // TODO: change to walkAsync?
        fileList = walkSync(`${filePath}/${fileList}`, fileList);
      } else {
        fileList.push(file);
      }
    });
    return fileList;
  };

  const filesToRender = {};
  /**
   * Given a request from a client
   * The request is associated with a file on the file system
   * Called the RequestFile
   */
  class FilesToRenderCache {
    /**
     * initialize the requested file object
     */
    constructor() {
    }

    /**
     * load list of files to render from the product view folder
     * @param {string} rootFolder
     * @param {Array} productCache
     */
    static loadListFromFolder(rootFolder, productCache) {
      walkSync(rootFolder, productCache);
    }

    /**
     * load list of files to render from the product view folder
     * the list is cached when the 1st request is coming in
     * @param {app} app
     * @param {Product} product
     */
    initCacheFilesToRender(app, product) {
      // TODO: extract outside to outer scope &
      // TODO: ... the all products load when server loads?
      if (filesToRender.hasOwnProperty(product.url)) {
        throw new Error(
          `(FilesToRenderCache:initCacheFilesToRender) Error - 
          duplicate product url, product url: ${product.url}`);
      }
      filesToRender[product.url] = [];
      const rootFolder = `${app.get('appPath')}${product.prodTemplate}/views`;
      FilesToRenderCache.loadListFromFolder(
        rootFolder, filesToRender[product.url]);
    }

    /**
     * check if keys exists in cache by product & filePath
     * @param {Product} product
     * @param {string} renderFilePath
     * @return {boolean}
     */
    exists(product, renderFilePath) {
      return filesToRender[product.url].indexOf(renderFilePath) > -1;
    }
  }

  return FilesToRenderCache;
})();

