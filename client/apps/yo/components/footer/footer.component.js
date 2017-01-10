import angular from 'angular';

export class FooterComponent {}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.html'), // eslint-disable-line global-require
    controller: FooterComponent,
  })
  .name;
