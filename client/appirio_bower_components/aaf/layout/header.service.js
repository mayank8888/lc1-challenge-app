(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')
    .service('HeaderService', HeaderService);

  /**
   * @name UserProfileService
   * @desc General Angular Challenge Service
   * @ngInject
   */
  HeaderService.$inject = ['Utils'];
  function HeaderService(Utils) {
    
    var serviceAPI = {
      getUserProfile: getUserProfile
    };

    return serviceAPI;

    /***** Private Functions *****/

	  function getUserProfile() {
      //TODO: replace w/ real ajax call
      return Utils.getJsonData('appirio_bower_components/aaf/layout/data/user-profile.json');
    }
  }

})(window, window.angular);