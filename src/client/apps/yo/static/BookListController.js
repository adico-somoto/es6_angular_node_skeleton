// public/client/BookListController.js
angular.module('app')
  .controller('BookListController', ['$scope', function($scope) {
  $scope.title = 'html';

  $scope.books= [
    {name: 'How to Win Friends and Influence People'},
    {name: 'Good to Great'},
    {name: 'The Lean Startup'},
    {name: 'The Art of the Start'},
    {name: 'Think and Grow Rich'},
    {name: 'The E Myth'},
    {name: 'Build To Last'},
  ];
}]);
