(function(window, angular, undefined) {
  'use strict';

	angular.module('manageChallenge')
  .constant("config", {
    "baseURL": "http://www.topcoder.com/challenge-details/"
  })

//TODO(DG: 10/14/2014): evaluate if we should use $.inject to support
//https://github.com/johnpapa/angularjs-styleguide#single-responsibility
	.controller('ChallengeListController', [ '$scope', '$filter', 'browser', 'ngTableParams', 'challenges', 'matchmedia', 'config', 'ManageChallengeUtils',
		function returnChallengeController($scope, $filter, browser, ngTableParams, challenges, matchmedia, config, Utils) {

      //TODO(DG: 10/16/2014): use native angular...
      //add TC url to all challenge objects
      _(challenges).each(function(challenge) { 
        challenge.url = config.baseURL + challenge.id;
      });

      //TODO(DG: 10/10/16/2014): evaluate use of this; https://github.com/johnpapa/angularjs-styleguide#controllers
			$scope.challenges = challenges;

			//user-agent stuff
      $scope.portrait = false;
      $scope.browser = browser();
      $scope.phone = matchmedia.isPhone();

      //TODO(DG: 10/15/2014): replace w/ ng-grid
      //TODO(DG: 10/15/2014): meet w/ kyle/neil on ng-grid 101
			//table stuff
      var headers = [
        {
          "colName": "Name",
          "col": "challengeName"
        },
        {
          "colName": "Account",
          "col": "accountName"
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

      Utils.handleTable($filter, $scope, ngTableParams, headers, challenges, sort);
		}
	])


  //TODO: remove or replace when we refactor to use ng-grid
  //helper function for setting ng-tables


})(window, window.angular);