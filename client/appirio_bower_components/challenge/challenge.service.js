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
      updateScorecardItems: updateScorecardItems,

      //Result APIs
      getResults: getResults
    };

    return serviceAPI;

    /***** Private Functions *****/

    function getSubmissions(challengeId) {
      var deferred = $q.defer();
      Utils.apiGet('/_api_/challenges/' + challengeId + '/submissions').then(function (result) {
        // Enable once statuses are available on submissions
        // _.forEach(result.content, function(submission) {
        //   submission.statusDisplay = Utils.initCase(submission.status)
        // });

        deferred.resolve(result);
      })

      return deferred.promise;

    }

    function getSubsAndFiles(challengeId) {
      var deferred = $q.defer();
      getSubsAndScorecards(challengeId).then(function(subsScores) {
        Utils.apiGet('/_api_/challenges/' + challengeId + '/files/').then(function(res) {

          var files = res.content;
          angular.forEach(files, function(file, key) {
            if (file.submissionId) {
              var key = _.findKey(subsScores.content, {id: file.submissionId})
              if (key) {
                subsScores.content[key].file = file;
              }
            }
          });
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

    function getRequirements(challengeId) {
      var deferred = $q.defer();
      Utils.apiGet('/_api_/challenges/' + challengeId + '/requirements').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    /* Scorecard APIs */
    function getScorecard(challengeId, scorecardId) {
      var deferred = $q.defer();

      //get scorecard items + associated requirements for a single scorecard
      Utils.apiGet('/_api_/challenges/' + challengeId + '/scorecards/' + scorecardId).then(function(result) {
        getScorecardItems(challengeId, scorecardId).then(function(scorecardItems) {
          result.content.scorecardItems = scorecardItems;
          getRequirements(challengeId, scorecardId).then(function(requirements) {
            _.forEach(scorecardItems.content, function(scorecardItem) {
              scorecardItem.requirement = _.first(_.where(requirements.content, {
                id : scorecardItem.requirementId
              }));

            });
            deferred.resolve(result);
          });
        })
      });

      return deferred.promise;
    }

    function getScorecards(challengeId) {
      var deferred = $q.defer();
      if (_useLocal) {
        Utils.getJsonData('appirio_bower_components/challenge/data/scorecards.json').then(function(scorecards) {
          deferred.resolve(_.where(scorecards, {
            'challengeId': parseInt(challengeId)
          }));
        });
      } else {
        Utils.apiGet('/_api_/challenges/' + challengeId + '/scorecards').then(function(result) {
          // Add Init cased statuses
          // _.forEach(result.content, function(scorecard) {
          //   if (scorecard.status !== null) {
          //     scorecard.statusDisplay = Utils.initCase(scorecard.status)
          //   }

          // });
          deferred.resolve(result);
        });
      }
      return deferred.promise;
    }

    function getScorecardItems(challengeId, scorecardId) {
      var deferred = $q.defer();
      Utils.apiGet('/_api_/challenges/' + challengeId + '/scorecards/' + scorecardId + '/scorecardItems').then(function(result) {
        deferred.resolve(result);
      });

      return deferred.promise;
    }

    function deleteScorecard() {
      var body = {
        id: 12
      };

      return Utils.apiPost('/_api_/challenges/4/scorecards', body);
    }
    function createScorecard(challengeId, submissionId) {
      var deferred = $q.defer();
      var promises = [];
      var body = {
        status: 'VALID',
        reviewerId: 222,  //req'd; TODO(DG: 11/12/2014): use real user id
        submissionId: parseInt(submissionId) //req'd
      };

      Utils.apiPost('/_api_/challenges/' + challengeId + '/scorecards', body).then(function(scorecard) {
        getRequirements(challengeId).then(function(reqs) {
          _.forEach(reqs.content, function(req) {
            var body = {
              "requirementId": req.id,
              "score": -1
            };
            var promise = Utils.apiPost('/_api_/challenges/' + challengeId + '/scorecards/' + scorecard.id + '/scorecardItems', body)
            promises.push(promise);
          });
          $q.all(promises).then(function() {
            deferred.resolve(scorecard);
          })
        });
      })
      return deferred.promise;
    }

    function updateScorecardItems(challengeId, scorecardItems) {
      var deferred = $q.defer();
      var promises = [];
      _.forEach(scorecardItems, function(scorecard) {
        var promise = updateScorecardItem(challengeId, scorecard)
        promises.push(promise);
      })
      $q.all(promises).then(function() {
        deferred.resolve();
      })
      return deferred.promise;
    }

    function updateScorecardItem(challengeId, scorecardItem) {
      var scorecardId = scorecardItem.scorecardId;
      var body = {
        requirementId: scorecardItem.requirementId, //TODO(DG: 11/12/2014): Remove; currently req'd #280
        score: scorecardItem.score
      };
      if (scorecardItem.comment) {
        body.comment = scorecardItem.comment
      }
      return Utils.apiUpdate('/_api_/challenges/' + challengeId + '/scorecards/' + scorecardId + '/scorecardItems/' + scorecardItem.id, body);

    }

    /* Result APIs */
    function getResults(challengeId) {
      var deferred = $q.defer();
      getSubsAndFiles(challengeId).then(function(subsScores) {
          var winningSubs = _.filter(subsScores.content, function(item) {
            return item.scorecard.pay;
          });
          subsScores.content = winningSubs;
          deferred.resolve(subsScores);
      });
      return deferred.promise;
    }

    function getSubsAndScorecards(challengeId) {
      if (_useLocal) {
        return Utils.getJsonData('appirio_bower_components/challenge/data/results.json');
      } else {
        var deferred = $q.defer();
        getSubmissions(challengeId).then(function(subs) {
          getScorecards(challengeId).then(function(scorecards) {
            //get submitter id for
            _.forEach(scorecards.content, function(scorecard) {
              var submission = _.where(subs.content, {id: scorecard.submissionId})[0];
              if (submission) {
                submission.scorecard = scorecard;
              } else {
                //Submission doesn't have a scorecard yet
              }

            });

            deferred.resolve(subs);
          })


        })
        return deferred.promise;
      }
    }

  }

})(window, window.angular);