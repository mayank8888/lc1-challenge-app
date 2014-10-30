(function (window, angular, undefined) {
  'use strict';

  var module = angular.module('manageChallenge')
    .controller('ResultsController', ResultsController);

  //TODO(DG: 10/20/2014): Update jsdoc
  /**
   * @name ResultsController
   * @ngInject
   */
  function ResultsController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedChallengeResults, resolvedCurrentChallenge) {
    var vm = this;
    vm.results = resolvedChallengeResults;
    vm.challenge = resolvedCurrentChallenge;
    vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;
    vm.tcMemberProfileUrl = tcMemberProfileUrl;

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
    function tcChallengeDetailsUrl(challenge) {
      return TC_URLS.baseChallengeDetailsUrl + challenge.id;
    }

    function tcMemberProfileUrl(memberHandle) {
      console.log('memberHandle', memberHandle)
      return TC_URLS.baseMemberProfileUrl + memberHandle;
    }

  }

})(window, window.angular);