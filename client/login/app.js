(function(window, angular, undefined) {
  'use strict';

  angular.module('tc.login', [])
  .controller('LoginController', LoginController)

  function LoginController() {
  	var vm = this;
  	vm.auth0Host = 'https://serenity-tc.auth0.com';
  	vm.clientId = 'g3hdq1pfeuvnuayv96aMMpWKUnCWJjVb';
  	vm.redirectUri = 'http://localhost:8000/_auth_/callback';

  	vm.connections = [
			{
  			name: 'google',
  			displayName: 'Google Login'
  		},
			{
  			name: 'github',
  			displayName: 'Github Login'
  		},
			{
  			name: 'twitter',
  			displayName: 'Twitter Login'
  		},
			{
  			name: 'facebook',
  			displayName: 'Facebook Login'
  		}
  	];
  }

})(window, window.angular);