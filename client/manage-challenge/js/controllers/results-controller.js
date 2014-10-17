(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .constant("config", {
      "baseURL": "http://www.topcoder.com/challenge-details/"
    })


    .controller("ResultsController", ['$scope',
      function returnResultsController($scope) {
        //TODO: Implement
      }
    ]);

})(window, window.angular);