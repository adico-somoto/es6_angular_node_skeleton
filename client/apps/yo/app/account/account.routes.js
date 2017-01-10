'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'), // eslint-disable-line global-require
    controller: 'LoginController',
    controllerAs: 'vm',
  })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';

        const referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      },
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'), // eslint-disable-line global-require
      controller: 'SignupController',
      controllerAs: 'vm',
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'), // eslint-disable-line global-require
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true,
    });
}
