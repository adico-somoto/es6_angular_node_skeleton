/**
 * Author: adico@somoto.net
 * Created on: ${DATE}.
 *
 * Overview:
 *
 */

'use strict';

import rp from 'request-promise';

const requests = (function() {

  class Requests {
    static getBrandsPromise() {
      const options = {
        uri: 'http://www.yo.com:8080/brandsData.json',
        json: true // Automatically parses the JSON string in the response
      };

      return rp(options);
    }
  }

  return Requests;
})();

exports = module.exports = requests;
