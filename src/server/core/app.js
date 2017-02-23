'use strict';

import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon';
import productsSpecMod from './productSpec/productsSpec';
import RenderedFileCache from './rendredFileCache';
import FilesToRenderCache from './filesToRenderCache';
import initRoutes from './routes';

const app = express();

// TODO: move to config
/**
 * Normalize a port into a number, string, or false.
 * @param {number|string} val
 * @return {*}
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// TODO: hook to specific static routes of the various apps
console.log(__dirname);
app.use('/', express.static('dist/client'));
app.use('/', express.static('dist/client/apps/yo'));
app.use('/', express.static('dist/client/apps/mo'));

// TODO: remove the next line when proper API will be replaced
app.use('/', express.static(path.resolve(__dirname, '../mockData')));

app.set('view engine', 'ejs');

/**
 * custom render for our multi-products infrastructure
 * allows rendering pages by dynamic root path
 * references:
 * http://stackoverflow.com/questions/21885377/change-express-view-folder-based-on-where-is-the-file-that-res-render-is-calle
 * http://caridy.name/blog/2013/05/bending-express-to-support-synthetic-views/
 * @param {string} root - path to the file
 * @param {string} name - the name of the file without extension
 * @param {object} opts - view model
 * @param {Function} fn - callback expects fn(err, html)
 * @return {*}
 */
app.customRender = (root, name, opts, fn) => {
  const engines = app.engines;
  const cache = app.cache;

  let view = cache[root + '-' + name];

  if (!view) {
    view = new (app.get('view'))(name, {
      defaultEngine: app.get('view engine'),
      root: root,
      engines: engines,
    });

    if (!view.path) {
      const err = new Error(
        'Failed to lookup view "' + name +
        '" in views directory "' + root + '"');
      err.view = view;
      return fn(err);
    }

    cache[root + '-' + name] = view;
  }

  try {
    view.render(opts, fn);
  } catch (err) {
    fn(err);
  }
};

// TODO:
// if('/* @echo NODE_ENV */' === 'custom') {
//     app.set('views', 'dist/server'); // for local view
// }
// else {
app.set('views', 'server');
// }

// TODO: products specs are loaded once when the server loads
// needs to reload configurations when they change in the admin like adding new
// brands
const ProductsSpec = productsSpecMod(app);
const renderedFileCache = new RenderedFileCache();
const filesToRenderCache = new FilesToRenderCache();

ProductsSpec.initProducts((err, products) => {
  if(err) {
    throw err;
  }

  for (const productUrl of products) {
    const product = products.getProductByUrl(productUrl);
    renderedFileCache.init(product);
    filesToRenderCache.initCacheFilesToRender(app, product);
  }

  app.set('productsSpecs', products);
});

// Load generic routes
initRoutes(app);

export default app;
