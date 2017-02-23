/**
 * Created by adi on 07/01/2017.
 */

'use strict';

import VanillaSpec from './vanillaSpec';
import WebView from './webviewSpec';

export default (() => {
  const pVanillasSpec = {
    pdf: new VanillaSpec('pdf', new WebView('window', 640, 385), 'tab'),
    ziprar: new VanillaSpec(
      'ziprar', new WebView('window', 300, 428), '', true),
    calendar: new VanillaSpec(
      'calendar', new WebView('browser', 0, 0), 'online'),
    motivation: new VanillaSpec(
      'motivation', new WebView('browser', 1024, 768), 'onlinetab'),
    yo: new VanillaSpec('yo', new WebView('browser', 1024, 768), 'onlinetab'),
    mo: new VanillaSpec('mo', new WebView('browser', 1024, 768), 'onlinetab'),
  };

  /**
   * Vanilla represents a product stripped of branding (white-label)
   * Vanilla Spec represents a set of properties that defines
   * the environment of the application
   */
  class VanillasSpec {
    /**
     * so far empty constructor
     */
    constructor() {
    }

    /**
     * get vanilla specification by product type identifier
     * @param {string} productType
     * @return {VanillaSpec|null}
     */
    getSpecByProduct(productType) {
      return pVanillasSpec[productType];
    }
  }

  return VanillasSpec;
})();
