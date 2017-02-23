/**
 * Author: adico@somoto.net
 * Created on: 28/01/2017.
 *
 * Overview:
 *
 */

'use strict';
import path from 'path';
import assert from 'assert';
import RenderedFileCache from './rendredFileCache';
import FilesToRenderCache from './filesToRenderCache';
export default (() => {
  const renderedFileCache = new RenderedFileCache();
  const filesToRenderCache = new FilesToRenderCache();
  /**
   * Given a request from a client
   * The request is associated with a file on the file system
   * Called the RequestFile
   */
  class RequestedFile {
    /**
     * initialize the requested file object
     * @param {Product} product
     * @param {IncomingMessage} req
     */
    constructor(product, req) {
      console.log('(RequestedFile) originalUrl:', req.url, req.originalUrl);
      this.app = req.app;
      this.appPath = req.app.get('appPath');
      this.filePath = req.originalUrl;
      assert(this.filePath.length);
      this.requireRender = false;
      this.product = product;

      if (this.filePath === '/') {
        this.filePath = '/index.html';
      }

      if (this.fileRequiresRender()) {
        this.requireRender = true;
        this.filePath = `views${this.filePath}`.replace('.html', '.ejs');
      } else {
        this.filePath = `static${this.filePath}`;
      }
      this.pathToFile =
        `${this.appPath}${product.prodTemplate}/${this.filePath}`;
    }

    /**
     * returns the render file from the requested file
     * @return {string}
     */
    get renderFilePath() {
      return this.filePath.replace('.html', '.ejs').replace('/', '');
    }

    /**
     * is requested file is a template that requires rendering
     * @return {boolean}
     */
    fileRequiresRender() {
      if (filesToRenderCache.exists(this.product, this.renderFilePath)) {
        return true;
      }
      return false;
    }

    /**
     * send the requested file back to the client
     * the file will be tested if it needs rendering
     * if so then it will be rendered and the result will be cached
     * otherwise it will be served from the static folder
     * @param {ServerResponse} res
     */
    send(res) {
      if (!this.requireRender) {
        res.sendFile(path.resolve(this.pathToFile));
      } else {
        if (renderedFileCache.exists(this.product, this.pathToFile)) {
          res.send(renderedFileCache.get(this.product, this.pathToFile));
        } else {
          // TODO: move to regex extract + refactor to some properties
          const pos1 = this.pathToFile.lastIndexOf('/');
          const pathToFile = this.pathToFile.substr(0, pos1);
          const file = this.pathToFile.substr(pos1 + 1);
          const pos2 = file.lastIndexOf('.');
          const viewName = file.substr(0, pos2);
          this.app.customRender(path.resolve(pathToFile), viewName,
            {product: this.product}, (err, html) => {
              if (err) {
                // TODO: change to the default 404 handler
                res.sendStatus(404);
              } else {
                renderedFileCache.set(this.product, this.pathToFile, html);
                renderedFileCache.printCacheStatistics();
                res.send(html);
              }
            });
        }
      }
    }
  }

  return RequestedFile;
})();

