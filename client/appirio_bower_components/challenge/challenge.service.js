(function (window, angular, undefined) {
  'use strict';

  angular
    .module('tc.challenge')
    .factory('ChallengeService', ChallengeService);

  /**
   * @name ChallengeService
   * @desc General Angular Challenge Service
   * @param {!angular.$http}
   * @param {!angular.$q}
   * @returns 
   * @ngInject
   */
  //ChallengeService.$inject = ['$http', '$q', 'Utils'];
  function ChallengeService($http, $q, Utils) {
    var _challenges;
    
    var serviceAPI = {
      //Challenge APIs
      getChallenge: getChallenge,
      getChallenges: getChallenges,
      deleteChallenge: deleteChallenge,

      //Scorecard APIs
      getScorecard: getScorecard,
      getScorecards: getScorecards,

      //Result APIs
      getResults: getResults
    };

    return serviceAPI;

    /***** Private Functions *****/

    /* Challenge APIs */
    function getChallenge(challengeId) {
      var deferred = $q.defer();

      getChallenges().then(function (challenges) {
        deferred.resolve(_.first(_.where(challenges, {'id': parseInt(challengeId)})));
      });
      return deferred.promise;
    }   


    function getChallenges() {
      var deferred = $q.defer();

      //check local cache first
      if (_challenges) {
        deferred.resolve(_challenges);
      } else {
        return Utils.getJsonData('appirio_bower_components/challenge/data/challenges.json');
      }
    }

    function deleteChallenge(challengeId) {
      //TODO(DG: 10/21/2014): replace w/ swagger client or real ajax call
      _.remove(_challenges, { 'id': challengeId });
    } 

    /* Scorecard APIs */
    function getScorecard(challengeId, sequence) {
      var deferred = $q.defer();

      getScorecards(challengeId).then(function (scorecards) {
        deferred.resolve(_.first(_.where(scorecards, {
          'challengeId': parseInt(challengeId),
          'sequence': sequence
        })));
      });
      return deferred.promise;
    }

    function getScorecards(challengeId) {
      var deferred = $q.defer();
      Utils.getJsonData('appirio_bower_components/challenge/data/scorecards.json').then(function(scorecards) {
        deferred.resolve(_.where(scorecards, {
          'challengeId': parseInt(challengeId)
        }));
      });

      return deferred.promise;

    }

    function updateScorecard(challengeId, submissionId, scorecardId) {
      //TODO: Implement
      throw new Error('Not Implemented');
    }    

    /* Result APIs */
    function getResults(challengeId) {
      return Utils.getJsonData('appirio_bower_components/challenge/data/results.json');
    }

  }

})(window, window.angular);