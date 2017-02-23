/**
 * Main application routes
 */

'use strict';

import express from 'express';
import path from 'path';
import errors from '../components/errors';
import thingApiMod from '../api/thing';
import userApiMod from '../api/user';
import authMod from '../auth';

export default (app) => {
  // Insert routes below

  // TODO: hook to specific routes of the various products
  // import routes from '../pdf/routes/index';

  app.all('/', (req, res, next) => {
    console.log('from all route: ', req.url);
    next();
  });

  // TODO: app.all('/api*', middleware.cors);
  // TODO: app.all('/api*', middleware.api); or app.all('/api*', middleware.auth);

  // TODO: /api route should be loaded with Route express command and group all API folder
  app.use('/api/things', thingApiMod);
  app.use('/api/users', userApiMod);

  app.use('/auth', authMod);

  // TODO: create a hook to load the routes of the specific products
  // The hook should iterate all products and load their specific router
  // when the server starts

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

// All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      console.log('from /* route: ', req.url);
      // get url
      let host = req.get('host').replace(':8080', '');
      let params = req.query;

      // get appObject matching url
      const products = app.get('productsSpecs'); // see app.js for corresponding app.set
      const product = products.getProductByUrl(host);

      // TODO: should be replaced with render - because we need to inject the brand or process for dev/prod
      // the index.html before letting the client side to the rest of its logic
      res.sendFile(path.resolve(`${app.get('appPath')}/apps/${product.prodTemplate}/index.html`));
    });


// catch 404 and forward to error handler
  app.use((req, res) => {
    const err = new Error('404 Not Found');
    res.status(404).end(JSON.stringify({
      message: err.message,
    }));
  });

// error handlers

// development error handler
// will print stacktrace
  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.end(JSON.stringify({
        message: err.message,
        error: err,
      }));
    });
  }

// production error handler
// no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.end({
      message: err.message,
      error: {},
    });
  });
}
