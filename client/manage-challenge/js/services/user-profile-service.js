(function(window, angular, undefined) {
  'use strict';

  var $http, $q, $timeout;

	angular.module('manageChallenge')

	//User Profile Service
	.service('UserProfileService', [ '$http', '$q', '$timeout',
		function returnUserProfileService(_$http, _$q, _$timeout) {
			//save off services for use by functions
			$http = _$http;
			$q = _$q;
			$timeout = _$timeout;

			return {
				"getUserProfile": getUserProfile
			};
		}
	]);

	function getUserProfile() {
		var deferred = $q.defer();

		//TODO: replace w/ real ajax call
		$http({method: 'GET', url: 'data/userProfile.json'})
		.success(function(data, status, headers, config){
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config){
			deferred.reject(data);
		});
		return deferred.promise;
	}

})(window, window.angular);