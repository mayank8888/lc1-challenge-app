(function(window, angular, undefined) {
  'use strict';

	angular.module('manageChallenge')
  .controller("ScorecardController", [ '$scope', '$filter', 'browser', 'matchmedia', 'ngTableParams', 'ChallengeService', 'ManageChallengeUtils',
    function returnScorecardController($scope, $filter, browser, matchmedia, ngTableParams, ChallengeService, Utils) {

      var scoreItems = [
        {
          "requirement": {
            "id": 1,
            "text": "Requirement 1 blah blah blah"
          },
          "score": '4',
          "comment": 'smart solution'          
        },
        {
          "requirement": {
            "id": 2,
            "text": "Requirement 2 blah blah blah"
          },
          "score": '',
          "comment": null
        }
      ];

      $scope.scoreItems = scoreItems;
      $scope.challenge = {
          id: "123",
          name: "fjdksal"
      };
      $scope.submission = {
        id: "1"
      };

      $scope.saveScorecard = function() {
        //TODO: Implement
      }

      //user-agent stuff
      $scope.portrait = false;
      $scope.browser = browser();
      $scope.phone = matchmedia.isPhone();


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

      Utils.handleTable($filter, $scope, ngTableParams, headers, scoreItems, sort);

    }
  ])  

})(window, window.angular);