//TODO(DG: 10/16/2014): look at https://gitlab.com/topcoderinc/tc-site/blob/master/wp-content/themes/tcs-responsive/js/app/challenges/app.js
//TODO(DG: 10/16/2014): investigate using ui.router instead
(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge').config(ManageChallengeConfig);

  /**
   * @name ManageChallengeConfig
   * @desc 
   * @param {!angular.$routeProvider}
   * @param {!angular.$locationProvider}
   * @returns 
   * @ngInject
   */  
  function ManageChallengeConfig($routeProvider, $locationProvider) {
    //provides the extra '/' after the hash 
    //eg. does this /manage/#/challenges instead of manage/#challenges
    //$locationProvider.hashPrefix('x');

    $routeProvider
      //show list of challenges
      .when("/challenges", {
        controller: "ChallengeListController",
        controllerAs: "vm",
        templateUrl: "challenge-list/challenge-list.html",
        resolve: {
          resolvedChallenges: function getChallenges(ChallengeService) {
            return ChallengeService.getChallenges();
          }
        }
      })

      //show all submissions for a given challenge
      .when("/challenges/:challengeId/submissions", {
        controller: "SubmissionsController",
        controllerAs: "vm",
        templateUrl: "submissions/submissions.html",
        resolve: {
          resolvedSubmissions: function getScorecards($route, ChallengeService) {
            return ChallengeService.getScorecards($route.current.params.challengeId);
          },
          resolvedCurrentChallenge: function getChallenge($route, ChallengeService) {
            return ChallengeService.getChallenge($route.current.params.challengeId);
          }
        }          
      })

      //show a scorecard for a given submission
      .when("/challenges/:challengeId/submissions/:submissionId/scorecard", {
        controller: "ScorecardController",
        controllerAs: "vm",
        templateUrl: "scorecard/scorecard.html",
        resolve: {
          resolvedScorecard: function getScorecard($route, ChallengeService) {
            return ChallengeService.getScorecard($route.current.params.challengeId, $route.current.params.submissionId);
          },
          resolvedCurrentChallenge: function getChallenge($route, ChallengeService) {
            return ChallengeService.getChallenge($route.current.params.challengeId);
          }          
        }
      })

      //show results for a challenge
      .when("/challenges/:challengeId/results", {
        controller: "ResultsController",
        controllerAs: "vm",
        templateUrl: "results/results.html",
        resolve: {
          resolvedChallengeResults: function getResults($route, ChallengeService) {
            return ChallengeService.getResults($route.current.params.challengeId);
          },
          resolvedCurrentChallenge: function getChallenge($route, ChallengeService) {
            return ChallengeService.getChallenge($route.current.params.challengeId);
          }
        }          

      })

      //default to list of challenges
      .otherwise({
        redirectTo: '/challenges'
      });
  }

})(window, window.angular);