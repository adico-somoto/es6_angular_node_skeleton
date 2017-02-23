/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that given a url will return a product object
 */

'use strict';

const WebView = (function createProduct() {

  class WebView {
    constructor(display, width, height) {
      this.display = display;
      this.width = width;
      this.height = height;
    }
  }

  return WebView;
})();

//exports = module.exports = WebView;
export default WebView;
