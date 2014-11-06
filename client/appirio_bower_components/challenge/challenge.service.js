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
  function ChallengeService($http, $q, Utils, TC_DATA_SOURCE) {
    var _challenges;
    var _useLocal = TC_DATA_SOURCE.challenge.useLocal || false;
    
    var serviceAPI = {
      //TEMP
      getSubmissions: getSubmissions,

      //Challenge APIs
      getChallenge: getChallenge,
      getChallenges: getChallenges,
      deleteChallenge: deleteChallenge,

      //Scorecard APIs
      getScorecard: getScorecard,
      getScorecards: getScorecards,
      createScorecard: createScorecard, 
      updateScorecardItem: updateScorecardItem,

      //Result APIs
      getResults: getResults
    };

    return serviceAPI;

    /***** Private Functions *****/

    function getSubmissions(challengeId) {
      var deferred = $q.defer();
      Utils.apiGet('/_api_/challenges/' + challengeId + '/scorecards/').then(function (result) {
        var scorecards = result.content;
        Utils.apiGet('/_api_/challenges/' + challengeId + '/files/').then(function(res) {
          var files = res.content;
          angular.forEach(files, function(file, key) {
            if (file.submissionId) {
              var x = _.where(scorecards, {
                id: file.submissionId
              });
              x[0].file = file;
            }
          });
          deferred.resolve(result);
        })
      });

      return deferred.promise;
    }

    /* Challenge APIs */
    function getChallenge(challengeId) {
      var deferred = $q.defer();
      Utils.apiGet('/_api_/challenges/' + challengeId).then(function(res) {
        deferred.resolve(res.content);
      });

      return deferred.promise;
    }   


    function getChallenges() {
      var deferred = $q.defer();

      //check local cache first
      if (_challenges) {
        deferred.resolve(_challenges);
      } else {
        //TODO(DG: 11/3/2014): Investigate better way to toggle
        if (_useLocal) {
          return Utils.getJsonData('appirio_bower_components/challenge/data/challenges.json');
        } else {
          return Utils.apiGet('/_api_/challenges');
        }
      }
    }

    function deleteChallenge(challengeId) {
      //TODO(DG: 10/21/2014): replace w/ swagger client or real ajax call
        var deferred = $q.defer();
        if (_useLocal) {
          _.remove(_challenges, { 'id': challengeId });
          return deferred.resolve();
        } else {
          _.remove(_challenges, { 'id': challengeId });
          return Utils.apiDelete('/_api_/challenges/' + challengeId);
        }
        return deferred.promise;

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
      // var deferred = $q.defer();
      // Utils.getJsonData('appirio_bower_components/challenge/data/scorecards.json').then(function(scorecards) {
      //   deferred.resolve(_.where(scorecards, {
      //     'challengeId': parseInt(challengeId)
      //   }));
      // });

      // return deferred.promise;
      return Utils.apiGet('/_api_/challenges/' + challengeId + '/scorecards');

    }

    function deleteScorecard() {
      var body = {
        id: 12
      };

      return Utils.apiPost('/_api_/challenges/4/scorecards', body);
    }
    function createScorecard() {
      var body = {
        // scoreSum: 97,
        // scorePercent: 96.5,
        // scoreMax: 99.9,
        status: 'VALID',
        // pay: false,
        // place: 1,
        // prize: 1500,
        // challengeId: 111,
        reviewerId: 222,  //req'd
        submissionId: 333 //req'd
      };

      return Utils.apiPost('/_api_/challenges/4/scorecards', body);
    }

    function updateScorecard(challengeId, submissionId, scorecardId) {
      //TODO: Implement
      throw new Error('Not Implemented');
    }    

    function updateScorecardItem(challengeId, submissionId, scorecardId, requirementId, scorecardItemId) {
      //TODO: Implement
      challengeId = 4;
      submissionId = 2;
      scorecardId = 2;
      scorecardItemId = 1;
      requirementId = 17;
      var body = {
        "id": 2,
        "scorecardId": 2,
        "requirementId": 17,
        "score": 21
      };
      console.log("DOING UPDATE2: ", body);
      //return Utils.apiUpdate('/_api_/challenges/' + challengeId);
      return Utils.apiUpdate('/_api_/challenges/' + challengeId + '/scorecards/' + scorecardId + '/scorecardItems/' + scorecardItemId, body);
      
    }    

    /* Result APIs */
    function getResults(challengeId) {
      return Utils.getJsonData('appirio_bower_components/challenge/data/results.json');
    }

  }

})(window, window.angular);