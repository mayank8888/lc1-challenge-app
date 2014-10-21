(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ChallengeListController', ChallengeListController);

  //TODO(DG: 10/20/2014): Cleanup params + add jsdoc
  /**
   * @name ChallengeListController
   * @desc 
   * @param {!angular.$http}
   * @param {!angular.$q}
   * @returns 
   * @ngInject
   */
  ChallengeListController.$inject = ['$scope', 'matchmedia', 'ChallengeService', 'Utils', 'TC_URLS', 'resolvedChallenges'];
  function ChallengeListController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedChallenges) {
    var vm = this;
    vm.challenges = resolvedChallenges;
    vm.tcChallengeDetailsURL = tcChallengeDetailsURL;
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
          "col": "name"
        },
        {
          "colName": "Account",
          "col": "account.name"
        },
        {
          "colName": "Last Updated",
          "col": "lastUpdatedAt"
        },
        {
          "colName": "Status",
          "col": "status"
        }
      ];

      var sort = {lastUpdatedAt: 'desc'};
      Utils.handleTable(vm, $scope, headers, vm.challenges, sort);      
    }

    //helper functions
    function tcChallengeDetailsURL(challenge) {
      return TC_URLS.baseDetailsURL + challenge.id;
    }

    function deleteChallenge(challenge) {
      ChallengeService.deleteChallenge(challenge.id);
    }
  }


})(window, window.angular);