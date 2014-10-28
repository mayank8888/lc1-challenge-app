(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('SubmissionsController', SubmissionsController);

    SubmissionsController.$inject = ['$scope', 'matchmedia', 'ChallengeService', 'Utils', 'TC_URLS', 'resolvedSubmissions', 'resolvedCurrentChallenge'];
    function SubmissionsController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedSubmissions, resolvedCurrentChallenge) {
      var vm = this;
      vm.submissions = resolvedSubmissions;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsURL = tcChallengeDetailsURL;

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
      function tcChallengeDetailsURL(challenge) {
        return TC_URLS.baseDetailsURL + challenge.id;
      }

    }
    

})(window, window.angular);