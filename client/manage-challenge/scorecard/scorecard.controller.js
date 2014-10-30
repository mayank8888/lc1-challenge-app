(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ScorecardController', ScorecardController);

    ScorecardController.$inject = ['$location', '$scope', 'matchmedia', 'ChallengeService', 'Utils', 'TC_URLS', 'resolvedScorecard', 'resolvedCurrentChallenge'];
    function ScorecardController($location, $scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedScorecard, resolvedCurrentChallenge) {
        //dummy data
        var scoreItems = [
          {
            "requirement": {
              "id": 1,
              "text": "Requirement 1 description"
            },
            "score": '4',
            "comment": 'smart solution'
          },
          {
            "requirement": {
              "id": 2,
              "text": "Requirement 2 description"
            },
            "score": '',
            "comment": null
          }
        ];

      var vm = this;
      vm.scoreItems = scoreItems;
      vm.scorecard = resolvedScorecard;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsURL = tcChallengeDetailsURL;
      vm.saveScorecard = saveScorecard;

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
            "colName": "Requirement",
            "col": "requirement"
          },
          {
            "colName": "Score",
            "col": "score"
          },
          {
            "colName": "Comment",
            "col": "comment"
          }
        ];


        Utils.handleTable(vm, $scope, headers, vm.scoreItems, sort);
      }

      //helper functions
      function tcChallengeDetailsURL(challenge) {
        return TC_URLS.baseDetailsURL + challenge.id;
      }

      function saveScorecard() {
        //TODO: implement
        console.log('implement save scorecard');
        $location.path('/challenges/' + vm.challenge.id + '/submissions/')
      }

    }


})(window, window.angular);
