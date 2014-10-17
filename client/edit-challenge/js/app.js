console.log('in this one2');

(function (window, angular, undefined) {
  'use strict';

  angular.module('editChallenge', [

    //3rd party
    'ngRoute',
    'ui.autocomplete',
    'ui.bootstrap',
    'taiPlaceholder',
    'angularFileUpload',

    //custom
    'controllers',
    'serenityServices',
    'directives'
  ])

    .config(['$locationProvider', '$routeProvider',
      function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');

        $routeProvider
          .when('/new', {
            controller: 'NewChallengeController',
            template: ''
          })
          .when('/challenges/:challengeId/edit', {
            controller: 'EditChallengeController',
            template: ''
          })
          //redirect invalid urls to challenge management page
          .otherwise({
            redirectTo: function () {
              window.location.href = '/';
            }
          });
      }
    ])

    .controller('NewChallengeController', NewChallengeController)
    .controller('EditChallengeController', EditChallengeController);

  function NewChallengeController($location) {
    //TODO: stub code. Actually create a challenge
    var newChallengeId = Date.now();

    //after challenge has been created redirect user to edit page for that challenge
    $location.path('/challenges/' + newChallengeId + '/edit');
  }

  function EditChallengeController($log, $routeParams, $scope) {
    //TODO: stub code. Implement
    $log.debug('TODO: Show edit page for challenge: ' + $routeParams.challengeId);
    $scope.challenge = {
      id: $routeParams.challengeId
    }
  }

})(window, window.angular);