'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    template: require('./admin.html'), // eslint-disable-line global-require
    controller: 'AdminController',
    controllerAs: 'admin',
    authenticate: 'admin',
  });
}
