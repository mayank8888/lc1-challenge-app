(function(window, angular, undefined) {
  'use strict';

	angular.module('manageChallenge')
  .constant("config", {
    "baseURL": "http://www.topcoder.com/challenge-details/"
  })

	.controller('SubmissionsController', [ '$routeParams', '$scope', '$filter', 'browser', 'ngTableParams', 'matchmedia', 'submissions', 'ChallengeService', 'ManageChallengeUtils',
		function returnSubmissionsController($routeParams, $scope, $filter, browser, ngTableParams, matchmedia, submissions, ChallengeService, Utils) {

      ChallengeService.getChallenge($routeParams.challengeId).then(function(challenge) {
        $scope.challenge = challenge;
      });

			$scope.submissions = submissions;

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

      Utils.handleTable($filter, $scope, ngTableParams, headers, submissions, sort);
		}
	]);

})(window, window.angular);