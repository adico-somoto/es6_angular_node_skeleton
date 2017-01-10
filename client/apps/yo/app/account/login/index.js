'use strict';

import angular from 'angular';
import LoginController from './login.controller';

export default angular.module('workApp.login', [])
  .controller('LoginController', LoginController)
  .name;
