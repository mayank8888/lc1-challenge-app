(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('SubmissionsController', SubmissionsController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name SubmissionsController
     * @ngInject
     */
    function SubmissionsController($scope, matchmedia, ChallengeService, Utils, TC_URLS, submissionData, resolvedCurrentChallenge) {
      var vm = this;
      vm.submissions = submissionData.content;
      vm.totalCount = submissionData.metadata.totalCount;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;

      //user-agent stuff
      vm.browser = Utils.getBrowser();
      vm.phone = matchmedia.isPhone();

      activate();

      function activate() {

        //table stuff
        var sort = {id: 'asc'}; //sequence
        var headers = [
          {
            "colName": "Id",
            "col": "id" //TODO(DG: 11/3/2014): want to use 'sequence' instead
          },
          {
            "colName": "Date Submitted",
            "col": "updatedAt" //submittedAt
          },
          {
            "colName": "Reviewer",
            "col": "updatedBy" //reviewer
          },
          {
            "colName": "Score",
            "col": "scoreSum" //score
          },
          {
            "colName": "Status",
            "col": "status"
          }
        ];


        Utils.handleTable(vm, $scope, headers, vm.submissions, vm.totalCount, sort);

      }

      //helper functions
      function tcChallengeDetailsUrl(challenge) {
        return TC_URLS.baseChallengeDetailsUrl + challenge.id;
      }

    }


})(window, window.angular);