import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';

  /* @ngInject */
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', () => socket.unsyncUpdates('thing'));
  }

  $onInit() {
    this.$http.get('/api/things')
      .then((response) => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing,
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`); // eslint-disable-line no-underscore-dangle
  }
}

export default angular.module('workApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'), // eslint-disable-line global-require
    controller: MainController,
  })
  .name;
