(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .constant("config", {
      "baseURL": "http://www.topcoder.com/challenge-details/"
    })

    .controller("ProfileController", ['$scope', 'UserProfileService',
      function returnProfileController($scope, UserProfileService) {
        $scope.popoverProfile = false;

        //Get Profile Information
        UserProfileService.getUserProfile()
          .then(
          function (userProfile) {
            $scope.userInfo = userProfile;
          },
          function (data) {

          });

        //Profile Povover Open
        $scope.profile_open = function () {
          $scope.popoverProfile = !$scope.popoverProfile;
          $scope.mobileSearch = false;
        }

        //Profile Popover Hide
        $scope.profile_close = function () {
          $scope.popoverProfile = false;
        }
      }
    ]);

})(window, window.angular);