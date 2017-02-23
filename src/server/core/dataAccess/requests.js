/**
 * Author: adico@somoto.net
 * Created on: ${DATE}.
 *
 * Overview:
 *
 */

'use strict';

import rp from 'request-promise';

export default ((app) => {
  /**
   * This object encapsulate many API requests wrapping requests library
   */
  class Requests {
    /**
     * Each product can wear a white label brand called brands.
     * the following API caller is fetching a list of brands from the server
     * @return {Promise}
     */
    static getBrandsPromise() {
      const options = {
        uri: `http://www.yo.com:${app.get('port')}/brandsData.json`,
        json: true, // Automatically parses the JSON string in the response
      };

      return rp(options);
    }
  }

  return Requests;
});
