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
              "text": "Send us, bright one, light one, Horhorn, quickening and wombfruit. Send us, bright one, light one, Horhorn, quickening and wombfruit. Send us bright one, light one, Horhorn, quickening and wombfruit."
            },
            "score": '4',
            "comment": 'smart solution'
          },
          {
            "requirement": {
              "id": 2,
              "text": "Hoopsa, boyaboy, hoopsa! Hoopsa, hoyaboy, hoopsa! Hoopsa, boyaboy, hoopsa."
            },
            "score": '',
            "comment": null
          },
          {
            "requirement": {
              "id": 3,
              "text": "Universally that person's acumen is esteemed very little perceptive concerning whatsoever matters are being held as most profitable by mortals with sapience endowed to be studied who is ignorant of that which the most in doctrine erudite and certainly by reason of that in them high mind's ornament deserving of veneration constantly maintain when by general consent they affirm that other circumstances being equal by no exterior splendour is the prosperity of a nation more efficaciously asserted."
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
            "colName": "#",
            "col": "id"
          },
          {
            "colName": "Requirement",
            "col": "requirement"
          },
          {
            "colName": "Score",
            "col": "score"
          },
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