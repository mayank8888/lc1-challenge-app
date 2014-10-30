(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf.auth', ['ngCookies'])
  .factory('authInterceptor', AuthInterceptor)
  
  .config(function ($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider
      .when('/_auth_/login', {
        //Note: a value for template is req'd; cannot remove template attr
        template: '', 
        controller: LoginHandler
      })
      .when('/_auth_/logout', {
        template: '', 
        controller: LogoutHandler
      });
  });

  /**
   * @ngInject
   */
  function LoginHandler($location, $window) {
    //TODO(DG: 10/30/2014): fix handling of next
    var next = '/';
    var qs = $location.search();
    $log.debug('qs', qs)
    if (qs) {
      //TODO(DG: 10/30/2014): JWT validation
      var jwt = qs.jwt;
      
      //store token on client
      $window.sessionStorage.token = jwt;
      
      //clear tokens from qs
      $location.search('jwt', null);
      $location.search('state', null);

      $location.path('/').replace();
    }
  }

  /**
   * @ngInject
   */
  function AuthInterceptor($cookies, $log, $q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        //attempt to grab auth token in this order
        //1. browser session storage 
        //2. topcoder cookie (tcjwt)
        var token = $window.sessionStorage.token || $cookies.tcjwt;
        $log.debug('token: ' + token);
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          //TODO(DG: 10/30/2014): Properly handle the case where the user is not authenticated
          $log.error('tc-auth: auth failed', rejection);
        }
        return $q.reject(rejection);
      }
    };
  }

  /**
   * @ngInject
   */
  function LogoutHandler($window) {
    delete $window.sessionStorage.token;
  };

  
})(window, window.angular);