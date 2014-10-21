(function (window, angular, undefined) {
  'use strict';

  var module = angular.module('manageChallenge')
    .controller('ResultsController', ResultsController);

  //TODO(DG: 10/20/2014): Cleanup params + add jsdoc
  /**
   * @name ResultsController
   * @desc 
   * @param {!angular.$http}
   * @param {!angular.$q}
   * @returns 
   * @ngInject
   */
  ResultsController.$inject = ['$scope', 'matchmedia', 'ChallengeService', 'Utils', 'TC_URLS', 'resolvedChallengeResults', 'resolvedCurrentChallenge'];
  function ResultsController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedChallengeResults, resolvedCurrentChallenge) {
    var vm = this;
    vm.results = resolvedChallengeResults;
    vm.challenge = resolvedCurrentChallenge;
    vm.tcChallengeDetailsURL = tcChallengeDetailsURL;

    //user-agent stuff
    vm.browser = Utils.getBrowser();
    vm.phone = matchmedia.isPhone();

    activate();

    function activate() {
      //TODO(DG: 10/15/2014): replace w/ ng-grid
      //table stuff
      var headers = [
        {
          "colName": "Place",
          "col": "place"
        },
        {
          "colName": "Prize",
          "col": "prize"
        },
        {
          "colName": "Submitter",
          "col": "submission.submitter.handle"
        },
        {
          "colName": "Score",
          "col": "score"
        }
      ];

      var sort = {place: 'asc'};
      Utils.handleTable(vm, $scope, headers, vm.results, sort);
    }

    //helper functions
    function tcChallengeDetailsURL(challenge) {
      return TC_URLS.baseDetailsURL + challenge.id;
    }

  }

})(window, window.angular);