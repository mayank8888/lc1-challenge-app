(function (window, angular, undefined) {
  'use strict';

  var $http, $q, $timeout, _challenges;

  angular.module('manageChallenge')

    .service('ChallengeService', ['$http', '$q', '$timeout',
      function returnChallengeService(_$http, _$q, _$timeout) {
        //save off services for use by functions
        $http = _$http;
        $q = _$q;
        $timeout = _$timeout;

        //TODO: look at john papa for alternative

        //exposed Challenge Service methods
        return {
          "getChallenge": getChallenge,
          "getChallenges": getChallenges,
          "getScorecards": getScorecards,
          "getScorecard": getScorecard
        };
      }
    ]);

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
      //TODO: replace w/ real ajax call
      $http({method: 'GET', url: 'data/challenges.json'})
        .success(function (data, status, headers, config) {
          // $timeout(function() {
          _challenges = data;
          deferred.resolve(_challenges);
          // }, 8000);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
    }

    return deferred.promise;
  }

  function getScorecards(challengeId) {
    var deferred = $q.defer();

    //TODO: replace w/ real ajax call
    $http({method: 'GET', url: 'data/scorecards.json'})
      .success(function (data, status, headers, config) {
        deferred.resolve(_.where(data, {'challengeId': parseInt(challengeId)}));
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

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

  function getSubmissions() {

  }

  function getResults(challengeId) {
    //TODO: Implement
  }

  function updateScorecard(challengeId, submissionId, scorecardId) {
    //TODO: Implement
  }

})(window, window.angular);