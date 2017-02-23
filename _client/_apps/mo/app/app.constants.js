'use strict';

import angular from 'angular';
import sharedConstants from '../../../../_server/config/environment/shared';

export default angular.module('workApp.constants', [])
  .constant('appConfig', sharedConstants).name;
