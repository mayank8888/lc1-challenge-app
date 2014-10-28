(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge', [
    //3rd party
    'ngRoute',
    'ui.bootstrap',
    'matchmedia-ng',
    'taiPlaceholder',
    'ngTable', //TODO: replace w/ ng-grid

    'tc.aaf',
    'tc.challenge'
  ]);

})(window, window.angular);