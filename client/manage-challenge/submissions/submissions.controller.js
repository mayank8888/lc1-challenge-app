(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('SubmissionsController', SubmissionsController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name SubmissionsController
     * @ngInject
     */
    function SubmissionsController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedSubmissions, resolvedCurrentChallenge) {
      var vm = this;
      vm.submissions = resolvedSubmissions;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;

      //user-agent stuff
      vm.browser = Utils.getBrowser();
      vm.phone = matchmedia.isPhone();

      activate();

      function activate() {

        //table stuff
        var sort = {sequence: 'asc'};
        var headers = [
          {
            "colName": "Id",
            "col": "sequence"
          },
          {
            "colName": "Date Submitted",
            "col": "submittedAt"
          },
          {
            "colName": "Reviewer",
            "col": "reviewer"
          },
          {
            "colName": "Score",
            "col": "score"
          },
          {
            "colName": "Status",
            "col": "status"
          }
        ];

        Utils.handleTable(vm, $scope, headers, vm.submissions, sort);
      }
      
      //helper functions
      function tcChallengeDetailsUrl(challenge) {
        return TC_URLS.baseChallengeDetailsUrl + challenge.id;
      }

    }
    

})(window, window.angular);