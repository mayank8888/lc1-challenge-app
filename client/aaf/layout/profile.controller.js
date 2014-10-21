(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')
    .controller('ProfileController', ProfileController);

/**
   * @name ProfileController
   * @desc Temporary holder for Profile
   * @param {!HeaderService}
   * @returns 
   * @ngInject
   */
  function ProfileController(HeaderService) {
    var vm = this;
    vm.popoverProfile = false;

    //Get Profile Information
    HeaderService.getUserProfile().then(
      function (userProfile) {
        vm.userInfo = userProfile;
      },
      function (data) {

      });

    //Profile Povover Open
    vm.profile_open = function () {
      vm.popoverProfile = !vm.popoverProfile;
      vm.mobileSearch = false;
    }

    //Profile Popover Hide
    vm.profile_close = function () {
      vm.popoverProfile = false;
    }    

  }

})(window, window.angular);