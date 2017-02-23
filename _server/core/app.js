import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon';
import ProductsSpec from './productSpec/productsSpec';
import initRoutes from './routes';

const app = express();

// TODO: hook to specific static routes of the various apps
console.log(__dirname);
app.use('/', express.static('dist/client'));
app.use('/', express.static('dist/client/apps/yo'));
app.use('/', express.static('dist/client/apps/mo'));

// TODO: remove the next line when proper API will be replaced
app.use('/', express.static(path.resolve(__dirname, '../mockData')));

app.set('view engine', 'ejs');

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
ProductsSpec.initProducts((err,products) => {
  if(err) {
    throw err;
  }

  app.set('productsSpecs', products);
});

// Load generic routes
initRoutes(app);

module.exports = app;
