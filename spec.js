'use strict';
/*eslint-env node*/
var testsContext;

require('babel-polyfill');
require('angular');
require('angular-mocks');
require('./_client/_apps/yo/components/ui-router/ui-router.mock');
require('./_client/_apps/yo/components/socket/socket.mock');

testsContext = require.context('./client', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
