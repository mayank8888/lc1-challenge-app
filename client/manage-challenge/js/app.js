//TODO(DG: 10/16/2014): look at https://gitlab.com/topcoderinc/tc-site/blob/master/wp-content/themes/tcs-responsive/js/app/challenges/app.js
//TODO(DG: 10/16/2014): get juices flowing on ui.router
(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge', [
    //3rd party
    'ngRoute',
    'ui.bootstrap',
    'matchmedia-ng',
    'taiPlaceholder',
    'ngTable' //TODO: replace w/ ng-grid
  ])

  .config(["$routeProvider","$locationProvider",
    function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');

      $routeProvider
      .when("/challenges", {
        controller : "ChallengeListController",
        templateUrl: "templates/challenge-list.html",
        resolve: {
          challenges: function getChallenges(ChallengeService) {
            //console.log('getchallegnes');
            return ChallengeService.getChallenges();
          }
        }
      })

      .when("/challenges/:challengeId/submissions", {
        controller : "SubmissionsController",
        templateUrl: "templates/submissions.html",
        resolve: {
          submissions: function getScorecards($route, ChallengeService) {
            return ChallengeService.getScorecards($route.current.params.challengeId);
          }
        }          
      })

      .when("/challenges/:challengeId/submissions/:submissionId/scorecard", {
        controller : "ScorecardController",
        templateUrl: "templates/scorecard.html"
      })

      .when("/challenges/:challengeId/results", {
        controller : "ResultsController",
        templateUrl: "templates/results.html"
      })

      .otherwise({
        redirectTo: '/challenges'
      });
      
    }
  ]);

})(window, window.angular);