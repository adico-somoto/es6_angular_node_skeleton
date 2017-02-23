/**
 * Main application routes
 */

'use strict';

// import express from 'express';
import errors from '../components/errors';
import RequestedFile from './requestedFile';
// import thingApiMod from '../api/thing';
// import userApiMod from '../api/user';
// import authMod from '../auth';

export default (app) => {
  app.set('appPath', './src/client/apps/');
  // Insert routes below

  // TODO: hook to specific routes of the various products
  // import routes from '../pdf/routes/index';

  app.all('/', (req, res, next) => {
    console.log('from all route: ', req.url);
    next();
  });

  // TODO: app.all('/api*', middleware.cors);
  // TODO: app.all('/api*', middleware.api);
  // TODO: ... or app.all('/api*', middleware.auth);
  // TODO: /api route should be loaded with Route
  // TODO: ... express command and group all API folder
  // app.use('/api/things', thingApiMod);
  // app.use('/api/users', userApiMod);

  // app.use('/auth', authMod);

  // TODO: create a hook to load the routes of the specific products
  // The hook should iterate all products and load their specific router
  // when the server starts

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  /**
   * For each request coming in prepare and serve the proper file
   * @param {string} host
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  function serveFile(host, req, res) {
    // get appObject matching url
    // see app.js for the corresponding app.set
    const products = app.get('productsSpecs');
    console.log('(Routes.js:serveFile) host: , products:', host);
    console.dir(products);
    const product = products.getProductByUrl(host);
    // TODO: move to config or something
    console.log(
      '(Routes.js:serveFile) product.prodTemplate', product.prodTemplate);
    const requestedFile = new RequestedFile(product, req);
    requestedFile.send(res);
  }

// All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      console.log('from /* route: ', req.get('host'), req.url);
      // get url
      let host = req.get('host').replace(`:${app.get('port')}`, '');
      // let params = req.query;

      serveFile(host, req, res);
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
};
