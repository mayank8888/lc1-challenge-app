(function (window, angular, undefined) {
  'use strict';

  angular
    .module('tc.challenge')
    .factory('ChallengeService', ChallengeService);

  /**
   * @name ChallengeService
   * @desc Challenge API Wrapper
   * @param {!angular.$http}
   * @param {!angular.$q}
   * @returns
   * @ngInject
   */
  function ChallengeService($http, $q, Utils, TC_DATA_SOURCE) {
    var _challenges;
    var _useLocal = TC_DATA_SOURCE.challenge.useLocal || false;

    var serviceAPI = {
      getSubmissionsData: getSubsAndFiles,

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
      Utils.apiGet('/_api_/challenges/' + challengeId + '/submissions/').then(function (result) {
        var subs = result.content;
        deferred.resolve(subs);
      })

      return deferred.promise;

    }

    function getSubsAndFiles(challengeId) {
      var deferred = $q.defer();
      getSubsAndScorecards(challengeId).then(function(subsScores) {
        //console.log('subs back', subsScores)
        Utils.apiGet('/_api_/challenges/' + challengeId + '/files/').then(function(res) {

          var files = res.content;
          //console.log('files', files)
          angular.forEach(files, function(file, key) {
            //console.log('files', file.submissionId, file)
            if (file.submissionId) {

              // var submission = _.where(subsScores.content, {
              //   id: file.submissionId
              // });
              var key = _.findKey(subsScores.content, {id: file.submissionId})
              //console.log('submission', key)
              subsScores.content[key].file = file;
              //submittedFiles[0].file = file;
            }
          });
          //console.log('subs back', subsScores)
          deferred.resolve(subsScores);
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
          Utils.apiGet('/_api_/challenges').then(function(challenges) {
            _.forEach(challenges.content, function(challenge) {
              challenge.statusDisplay = Utils.initCase(challenge.status)
            });

            deferred.resolve(challenges);
          });
        }
      }
      return deferred.promise;

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
      if (_useLocal) {
        var deferred = $q.defer();
        Utils.getJsonData('appirio_bower_components/challenge/data/scorecards.json').then(function(scorecards) {
          deferred.resolve(_.where(scorecards, {
            'challengeId': parseInt(challengeId)
          }));
        });
        return deferred.promise;
      } else {
        return Utils.apiGet('/_api_/challenges/' + challengeId + '/scorecards');
      }
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
      var deferred = $q.defer();
      getSubsAndFiles(challengeId).then(function(subsScores) {
        //console.log('sc', subsScores.content)
          _.remove(subsScores.content, function(scorecard) {
            return !scorecard.pay;
          });
          subsScores.metadata.totalCount = subsScores.content.length;
          deferred.resolve(subsScores);
      });
      return deferred.promise;
    }

    function getSubsAndScorecards(challengeId) {
      //select * from scorecards where place is not null and pay = true and "challengeId" = {}
      if (_useLocal) {
        return Utils.getJsonData('appirio_bower_components/challenge/data/results.json');
      } else {
        var deferred = $q.defer();

        getScorecards(challengeId).then(function(scorecards) {
          //console.log('sc', scorecards)

          getSubmissions(challengeId).then(function(subs) {
            //console.log('subs', subs)
            //get submitter id for
            _.forEach(scorecards.content, function(scorecard) {
              //console.log(scorecard)
              var submission = _.where(subs, {id: scorecard.submissionId})[0]

              if (submission) {
                scorecard.submitterId = submission.submitterId;
              } else {
                //Invalid submissionId on a scorecard
              }

            });

            deferred.resolve(scorecards);
          })


        })
        return deferred.promise;
      }
    }

  }

})(window, window.angular);