(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .constant("TC_URLS", {
      "baseChallengeDetailsUrl": "http://www.topcoder.com/challenge-details/",
      "baseMemberProfileUrl": "https://www.topcoder.com/member-profile/"
    })
    .constant("TC_DATA_SOURCE", {
    	"challenge": {
    		useLocal: false
    	}
    });


})(window, window.angular);