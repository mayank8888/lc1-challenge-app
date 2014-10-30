(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ChallengeListController', ChallengeListController);

  //TODO(DG: 10/20/2014): Update jsdoc  
  /**
   * @name ChallengeListController
   * @desc 
   * @returns 
   * @ngInject
   */
  function ChallengeListController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedChallenges) {
    var vm = this;
    vm.challenges = resolvedChallenges;
    vm.toTCChallengeDetailsUrl = toTCChallengeDetailsUrl;
    vm.deleteChallenge = deleteChallenge;

    //user-agent stuff
    vm.browser = Utils.getBrowser();
    vm.phone = matchmedia.isPhone();

    activate();

    function activate() {

      //TODO(DG: 10/15/2014): replace w/ ng-grid
      //table stuff
      var headers = [
        {
          "colName": "Name",
          "col": "title"
        },
        {
          "colName": "Account",
          "col": "account.title"
        },
        {
          "colName": "Last Updated",
          "col": "updatedAt"
        },
        {
          "colName": "Status",
          "col": "status"
        }
      ];

      var sort = {updatedAt: 'desc'};
      Utils.handleTable(vm, $scope, headers, vm.challenges, sort);
    }

    //helper functions
    function toTCChallengeDetailsUrl(challenge) {
      return TC_URLS.baseChallengeDetailsUrl + challenge.id;
    }

    function deleteChallenge(challenge) {
      ChallengeService.deleteChallenge(challenge.id);
    }

  }


})(window, window.angular);
