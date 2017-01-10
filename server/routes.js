/**
 * Main application routes
 */

'use strict';

import path from 'path';
import errors from './components/errors';
import thingApiMod from './api/thing';
import userApiMod from './api/user';
import authMod from './auth';
import products from './core/products';

export default (app) => {
  // Insert routes below
  app.use('/api/things', thingApiMod);
  app.use('/api/users', userApiMod);

  app.use('/auth', authMod);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      const productConf = products.getProductByUrl(req.get('host'));
      // get url
      // get appObject matching url
      // res.sendFile(path.resolve(`${app.get('appPath')}/apps/${appObject.folderName}/index.html`));

      //res.sendFile(path.resolve(`${app.get('appPath')}/apps/yo/index.html`));
      res.sendFile(path.resolve(`${app.get('appPath')}/apps/${productConf.prodTemplate}/index.html`));
    });
}
