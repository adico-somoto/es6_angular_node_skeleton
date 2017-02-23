'use strict';

import angular from 'angular';

export function OauthButtonsController($window) {
  'ngInject';

  this.loginOauth = (provider) => {
    $window.location.href = `/auth/${provider}`; // eslint-disable-line no-param-reassign
  };
}

export default angular.module('workApp.oauthButtons', [])
  .directive('oauthButtons', () => ({
    template: require('./oauth-buttons.html'), // eslint-disable-line global-require
    restrict: 'EA',
    controller: OauthButtonsController,
    controllerAs: 'OauthButtons',
    scope: {
      classes: '@',
    },
  }))
  .name;
