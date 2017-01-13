/**
 * Created by adi on 07/01/2017.
 */

'use strict';

import VanillaSpec from './vanillaSpec';
import WebView from './webviewSpec';

const VanillasSpec = (function() {
  const pVanillasSpec = {
    pdf: new VanillaSpec('pdf', new WebView('window', 640, 385), 'tab'),
    ziprar: new VanillaSpec('ziprar', new WebView('window', 300, 428), '', true),
    calendar: new VanillaSpec('calendar', new WebView('browser', 0, 0), 'online'),
    motivation: new VanillaSpec('motivation', new WebView('browser', 1024, 768), 'onlinetab'),
    yo: new VanillaSpec('motivation', new WebView('browser', 1024, 768), 'onlinetab'),
    mo: new VanillaSpec('motivation', new WebView('browser', 1024, 768), 'onlinetab'),
  };

  class VanillasSpec {
    constructor() {
    }

    getSpecByProduct(productType) {
      return pVanillasSpec[productType];
    }
  }


  return VanillasSpec;
})();


exports = module.exports = VanillasSpec;
