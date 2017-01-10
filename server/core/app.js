import express from 'express';
import cors from 'cors';
import path from 'path';
// import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
// import fs from 'fs';
import multer from 'multer';
import productsGen from './products';
// import project from '../app/selectProject';

// TODO:
// import routes from '../pdf/routes/index';
const app = express();
const productsMod = productsGen(app);

// var products = JSON.parse( fs.readFileSync("typesPref.json") );

app.set('view engine', 'ejs');

// TODO:
// if('/* @echo NODE_ENV */' === 'custom') {
//     app.set('views', 'dist/server'); // for local view
// }
// else {
app.set('views', 'server');
// }

app.get('/', (req, res) => {
  let host = req.get('host');
  let params = req.query;

  const product = productsMod.getProductByUrl(host);

  // get pref.json
  // storage/hostname.com/pref.json
  // if params.apphost doesn't exist get pref.json from hostname.com

  // TODO:
  // project.selectProjectData(host, params)
  //     .then((data) => {
  //
  //         console.log('RESOLEVED', data);
  //         res.render(data.pref.prodTemplate + '/index', data);
  //
  //     })
  //     .catch((err) => {
  //         console.error('SelectProject Error! ', err);
  //     });
});

app.use('/', express.static(path.resolve(__dirname, '/../../www')));

// console.log('----------------------------------------------');
// console.log(__dirname);
// console.log('----------------------------------------------');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(multer({ dest:'/tmp/' }));

// WebView Static Routes -> Angular Code in www folder
// app.use('/', express.static(__dirname + '/../../www', {index: 'index.html'}));

// // legacy routes support
// app.use('/app', express.static(__dirname + '/../../www', {index: 'index.html'}));
// // without WebView!! Static Routes -> Angular Code in www folder
// app.use('/widget', express.static(__dirname + '/../../www', {index: 'index.html'}));
// app.use('/pdftoolkit', express.static(__dirname + '/../../www', {index: 'index.html'}));
// app.use('/baron', express.static(__dirname + '/../../www', {index: 'index.html'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

// TODO:
// app.use('/', routes);

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

module.exports = app;
