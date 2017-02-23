/**
 * Author: adico@somoto.net
 * Created on: 15/02/2017.
 *
 * Overview:
 *
 */
module.exports = {
  appMountId: 'ngApp',
  devServer: 'http://localhost:3001',
  googleAnalytics: {
    trackingId: 'UA-XXXX-XX',
    pageViewOnLoad: true,
  },
  meta: [
    {
      name: 'description',
      content: 'A better default template for html-webpack-plugin.',
    },
  ],
  mobile: true,
  links: [
    'https://fonts.googleapis.com/css?family=Roboto',
    {
      href: '/apple-touch-icon.png',
      rel: 'apple-touch-icon',
      sizes: '180x180',
    },
    {
      href: 'images/favicon.png',
      rel: 'icon',
      sizes: '32x32',
      type: 'image/png',
    },
  ],
  //scripts: [
    //'http://example.com/somescript.js',
    // {
    //   src: 'index.js',
    //   type: 'text/javascript',
    // },
  //],
  title: 'My App',
  _window: {
    env: {
      apiHost: 'http://myapi.com/api/v1',
    },
  },
};
