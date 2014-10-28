/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

  angular.module('edit.challenge', [

    //3rd party
    'ui.autocomplete',
    'ui.bootstrap',
    'taiPlaceholder',
    'angularFileUpload',
    'restangular',
    'ui.router',

    //custom
    'directives'
  ])

  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RestangularProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, RestangularProvider) {

      $locationProvider.hashPrefix('');

      RestangularProvider.addElementTransformer('requirements', false, function(element) {
        element.edit = false;
        return element;
      })
      .addElementTransformer('prizes', false, function(element) {
        if (element.prize) {
          element.active = true;
        } else {
          element.active = false;
        }
        return element;
      });

      // Use $urlRouterProvider to configure redirects(when) and invalid urls(otherwise).
      $urlRouterProvider
        .otherwise('/');

      $stateProvider
        .state('new-challenge', {
          url: '/new',
          templateUrl: 'templates/challenge-edit.html',
          controller : 'CreateChallengeController',
          resolve: {
            challenge: function getChallenge() {
              // return new challenge
              return {
                title: 'Untitled Challenge',
                type: 'Architecture',
              };
            }
          }
        })
        .state('edit-challenge', {
          url: '/{challengeId:[0-9]{1,9}}',
          templateUrl: 'templates/challenge-edit.html',
          controller : 'CreateChallengeController',
          resolve: {
            // resolve challenge by id
            challenge: function getChallenge($stateParams, ChallengeService) {
              return ChallengeService.getChallenge($stateParams.challengeId);
            }
<<<<<<< HEAD
          }
        });
=======
          });
      }
    ])

    .controller('NewChallengeController', NewChallengeController)
    .controller('EditChallengeController', EditChallengeController);

  function NewChallengeController($location) {
    //TODO: stub code. Actually create a challenge
    var newChallengeId = Date.now();

    //after challenge has been created redirect user to edit page for that challenge
    $location.path('/challenges/' + newChallengeId + '/edit').replace();
  }

  function EditChallengeController($log, $routeParams, $scope) {
    //TODO: stub code. Implement
    $log.debug('TODO: Show edit page for challenge: ' + $routeParams.challengeId);
    $scope.challenge = {
      id: $routeParams.challengeId
>>>>>>> upstream/master
    }

  ]);

})(window, window.angular);
