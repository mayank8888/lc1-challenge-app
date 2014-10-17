(function(window, angular, undefined) {

  'use strict';

  angular.module('manageChallenge')

  // TODO(DG: 10/14/2014): evaluate if we should use $.inject to support
  // https://github.com/johnpapa/angularjs-styleguide#single-responsibility
  .service('ManageChallengeUtils', ['$window',
    function returnManageChallengeUtils(window) {
      return {
        handleTable: handleTable
      };
    }
  ])

  .service('browser', ['$window', function($window) {
    return function() {
      var userAgent = $window.navigator.userAgent;
      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
      for(var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      }
      return 'unknown';
    }
  }]);

  //TODO: remove or replace when we refactor to use ng-grid
  //helper function for setting ng-tables
  function handleTable($filter, $scope, ngTableParams, headers, data, sorting) {
    var perPage = 10;

    $scope.meta = {
      total: data.length
    };

    $scope.columnHeaders = headers;

    $scope.tableParams = new ngTableParams(
    {
      page: 1, // show first page
      count: perPage, //fixed page size
      sorting: sorting // initial sorting
    }, 
    {
      total: data.length, // length of data
      getData: function($defer, params) {
        // use built-in angular filter
        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
        $defer.resolve($scope.tableRows=orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });    
  }

})(window, window.angular);