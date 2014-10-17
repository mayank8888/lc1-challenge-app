'use strict';

/* Services */
var serenityServices = angular.module('serenityServices', []);

//Sub Applications List
serenityServices.factory('customerAccountsList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/customerAccounts.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);