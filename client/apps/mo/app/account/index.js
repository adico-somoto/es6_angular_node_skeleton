'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';
import oauthButtons from '../../components/oauth-buttons';

export default angular.module('workApp.account', [uiRouter, login, settings, signup, oauthButtons])
  .config(routing)
  .run(($rootScope) => {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, pNext, nextParams, pCurrent) => {
      const next = pNext;
      const current = pCurrent;

      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
