// public/client/app.js
(function(angular) {
  'use strict';
  angular.module('app', ['ngRoute'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'bookList.html',
          controller: 'BookListController',
        });
    });
})(window.angular);
