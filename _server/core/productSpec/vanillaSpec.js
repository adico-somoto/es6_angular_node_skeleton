/**
 * Created by adi on 07/01/2017.
 */
/**
 * products will provide a function that given a url will return a product object
 * that consists of configuration for the requested product.
 *
 * Because each request requires a product object,
 * - the object properties better be defined on the prototype level.
 * - the inner logic should be cached on the server lifecycle & provided to the request,
 *   to reuse same objects between requests. We can't trust the module to cache it for us.
 *
 * TODO: The current file will be splitted into multiple classes files later
 *
 * We have 3 entities involved in a product specification
 * 1) product which consists of 2) vanilla product specification & 3) brand specification
 * Product is the parent, the container that groups the composite specifications of vanilla & brand
 */

'use strict';

const VanillaSpec = (function(){
  class VanillaSpec {
    constructor(productTemplate, webview, envTemplate, offline) {
      this.prodTemplate = productTemplate;
      this.webview = webview;
      this.envTemplate = envTemplate;
      this.offline = offline || false;
    }
  }

  return VanillaSpec;
})();

//exports = module.exports = VanillaSpec;
export default VanillaSpec;
