/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

	angular
	  .module('edit.challenge')
	  .controller('CreateChallengeController', CreateChallengeController);

	CreateChallengeController.$inject = ['$scope', '$timeout', '$filter', '$state', 'ChallengeService', 'challenge'];

	function CreateChallengeController($scope, $timeout, $filter, $state, ChallengeService, challenge) {
    
    $scope.challenge = challenge;
    $scope.publicBrowsing = {
      complete: false
    }
    
    /*save new challenge*/
    if ($scope.challenge && !$scope.challenge.id) {
      ChallengeService.createChallenge($scope.challenge).then(function(data) {
        $scope.challenge = data;
        $state.go('edit-challenge', {challengeId: $scope.challenge.id});
      });
    }

    /*watch challenge object*/
    $scope.$watch('challenge', function(newVal) {
      if (newVal.title && newVal.title.trim() && newVal.overview && newVal.overview.trim() && newVal.description && newVal.description.trim()) {
        $scope.publicBrowsing.complete = true;
      } else {
        $scope.publicBrowsing.complete = false;
      }
    }, true);

    /*save current challenge and related info*/
    $scope.saveChallenge = function() {
      if ($scope.timeLine.complete) {
        $scope.challenge.regStartAt = concatenateDateTime($scope.timeLine.stdt, $scope.timeLine.timeSelectedStart);
        $scope.challenge.subEndAt = concatenateDateTime($scope.timeLine.enddt, $scope.timeLine.timeSelectedEnd);
      }
      // update challenge info
      if ($scope.publicBrowsing.complete) {
        ChallengeService.updateChallenge($scope.challenge).then(function(data) {
          $scope.challenge = data;
        });
      }
      // save prizes
      if ($scope.prizes.complete) {
        var place = 1;
        angular.forEach($scope.placePrizes.places, function(prize) {
          if (prize.active && prize.prize > 0) {
            prize.place = place;
            if (prize.id) {
              ChallengeService.updatePrize(prize).then(function(data) {
                console.log('updated prize: ', data.id);
              });
            } else {
              ChallengeService.createPrize($scope.challenge.id, prize).then(function(data) {
                console.log('created prize: ', data.id);
              });
            }
            place += 1;
          }
        });
        // refetch prizes
        getPrizes();
      }
    };

    /*get accounts based on the query string*/
    $scope.accounts = [];
    function getAccounts(query) {
      // query is field=value
      ChallengeService.getAccounts(query).then(function(data) {
        $scope.accounts = data;
      });
    };

    /*get all tags*/
    $scope.allTags = [];
    function getAllTags() {
      ChallengeService.getAllTags().then(function(data) {
        $scope.allTags = data;
      });
    };
    getAllTags();

    /*launch a challenge*/
    $scope.launch = function() {
      ChallengeService.launch($scope.challenge).then(function(data) {
        console.log('launched challenge: ', $scope.challenge.id);
      });
    }

    /*------------------------*/
    /*  file browsing section */
    /*------------------------*/
    $scope.fileBrowsing = {
      uploadedFiles: [],
      complete: false
    };

    /*---------------------*/
    /* requirement section */
    /*---------------------*/
    $scope.requirements = {
      content: '',
      requirementList: [],
      complete: false
    };

    /*-----------*/
    /* Time line */
    /*-----------*/
    $scope.timeLine = {
      minDate: new Date(),
      startOpened: false,
      endOpened: false,
      isopen: false,
      isopenStart: false,
      complete: false
    };

    if ($scope.challenge.regStartAt) {
      var regStartAt = new Date($scope.challenge.regStartAt);
      $scope.timeLine.stdt = regStartAt;
      $scope.timeLine.timeSelectedStart = $filter('date')(regStartAt, 'HH:mm:ss');
    }

    if ($scope.challenge.subEndAt) {
      var subEndAt = new Date($scope.challenge.subEndAt);
      $scope.timeLine.enddt = subEndAt;
      $scope.timeLine.timeSelectedEnd = $filter('date')(subEndAt, 'HH:mm:ss');
    }

    /*open start calendar*/
    $scope.openStartCal = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.timeLine.startOpened = true;
      $scope.timeLine.endOpened = false;
    };

    /*end start calendar*/
    $scope.openEndCal = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.timeLine.endOpened = true;
      $scope.timeLine.startOpened = false;
    };

    /*calendar date format*/
    $scope.format = 'MM/dd/yyyy';
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    /*times*/
    $scope.times = [
      {'time': '00:00:00'},
      {'time': '01:00:00'},
      {'time': '02:00:00'},
      {'time': '03:00:00'},
      {'time': '04:00:00'},
      {'time': '05:00:00'},
      {'time': '06:00:00'},
      {'time': '07:00:00'},
      {'time': '08:00:00'},
      {'time': '09:00:00'},
      {'time': '10:00:00'},
      {'time': '00:00:00'},
      {'time': '11:00:00'},
      {'time': '12:00:00'},
      {'time': '13:00:00'},
      {'time': '14:00:00'},
      {'time': '15:00:00'},
      {'time': '16:00:00'},
      {'time': '17:00:00'},
      {'time': '18:00:00'},
      {'time': '19:00:00'},
      {'time': '20:00:00'},
      {'time': '21:00:00'},
      {'time': '22:00:00'},
      {'time': '23:00:00'}
    ];

    /*set start time*/
    $scope.setStartTime = function(time) {
      $scope.timeLine.timeSelectedStart = time.time;
      calculateDuration();
    };
    /*set end time*/
    $scope.setEndTime = function(time) {
      $scope.timeLine.timeSelectedEnd = time.time;
      calculateDuration();
    };

    /*set end date*/
    $scope.$watch('timeLine.stdt', function() {
      if ($scope.timeLine.stdt > $scope.timeLine.enddt) {
        $scope.timeLine.stdt = angular.copy($scope.timeLine.enddt);
      }
      calculateDuration();
      if ($scope.timeLine.stdt && $scope.timeLine.enddt && $scope.timeLine.dateDiff > 0) {
        $scope.timeLine.complete = true;
      } else {
        $scope.timeLine.complete = false;
      }
    });

    /*watch end date*/
    $scope.$watch('timeLine.enddt', function() {
      if ($scope.timeLine.stdt > $scope.timeLine.enddt) {
        $scope.timeLine.enddt = angular.copy($scope.timeLine.stdt);
      }
      calculateDuration();
      if ($scope.timeLine.stdt && $scope.timeLine.enddt && $scope.timeLine.dateDiff > 0) {
        $scope.timeLine.complete = true;
      } else {
        $scope.timeLine.complete = false;
      }
    });

    /*concatenate date and time*/
    function concatenateDateTime(date, hour) {
      // hour: hh:mm;ss
      var dateTime = angular.copy(date);
      if (hour) {
        var hms = hour.split(':');
        dateTime.setHours(hms[0], hms[1], hms[2], 0);
      }
      return dateTime;
    }

    /*get difference date*/
    function calculateDuration() {
      // use moment.js
      var start = moment(concatenateDateTime($scope.timeLine.stdt, $scope.timeLine.timeSelectedStart));
      var end = moment(concatenateDateTime($scope.timeLine.enddt, $scope.timeLine.timeSelectedEnd));
      $scope.timeLine.dateDiff = end.diff(start, 'days');
    };


    /*---------------*/
    /* Prize section */
    /*---------------*/
    $scope.prizes = {
      totalPrize: 0,
      customerAccountName: '',
      customerAccountId: '',
      activeCount: 2,
      complete: false
    };

    $scope.placePrizes = {
      places: [
        {
          id: 1,
          active: true,
          prize: '1200'
        }, {
          id: 2,
          active: true,
          prize: '600'
        }, {
          active: false,
          prize: null
        }, {
          active: false,
          prize: null
        }, {
          active: false,
          prize: null
        }
      ]
    };

    function getPrizes() {
      ChallengeService.getPrizes($scope.challenge.id).then(function(data) {
        for (var i=0; i<data.length; i+=1) {
          if (data[i].prize) {
            $scope.placePrizes.places[i] = data[i];
          }
        }
        if (data.length < 5) {
          for (var i=data.length; i<5; i+=1) {
            $scope.placePrizes.places[i] = {active: false, prize: null};
          }
        }
      });
    }
    // get prizes in the challenge
    if ($scope.challenge.id) {
      getPrizes();
    }
    
    /*set Place prize*/
    $scope.setPlacePrize = function(place, index) {
      // only last one can be activated
      if (index !== 0 && !$scope.placePrizes.places[index - 1].active) {
        return false;
      }
      place.active = true;
      place.prize = '';
    };

    /*remove Place prize*/
    $scope.removePlacePrize = function(place, index) {
      if (place.id) {
        ChallengeService.deletePrize(place).then(function(data) {
          console.log('deleted prize ', data.id);
        });
      }
      place.id = null;
      place.active = false;
      place.prize = null;
    };

    /*reorder prizes in descending order*/
    function prizeReorder() {
      $scope.placePrizes.places.sort(function(a, b) {
        if (a.active && !b.active) {
          return -1;
        } else if (!a.active && b.active) {
          return 1;
        } else {
          return Number(b.prize) - Number(a.prize);
        }
      });
    };

    /*watch prize change*/
    $scope.$watch('placePrizes', function(newVal) {
      // reorder prize
      prizeReorder();

      $scope.prizes.totalPrize = 0;
      $scope.prizes.activeCount = 0;
      // calculate the total prize
      angular.forEach($scope.placePrizes.places, function(value, key) {
        if (value.active) {
          $scope.prizes.activeCount += 1;
        }
        if (value.prize) {
          $scope.prizes.totalPrize += parseInt(value.prize);
        }
      });
      $scope.prizes.complete = (!!($scope.prizes.totalPrize > 0 && $scope.placePrizes.places[0].prize > 0) && $scope.prizes.customerAccountId);
    }, true);

    $scope.$watch('prizes.customerAccountId', function() {
      $scope.prizes.complete = (!!($scope.prizes.totalPrize > 0 && $scope.placePrizes.places[0].prize > 0) && $scope.prizes.customerAccountId);
    });

    /*customer account auto complete*/
    $scope.autoComplete = {
      options: {
        html: true,
        focusOpen: false,
        onlySelect: true,
        appendTo: '.customer-account-holder',
        position: {my: "left top", at: "left bottom", collision: "none"},

        source: function (request, response) {
          // customerAccountsList
          var promise = ChallengeService.getAccounts();
          promise.then(function(data) {
            response($.map(data, function(value) {
              if (value.name.toLowerCase().indexOf($scope.prizes.customerAccountName.toLowerCase()) > -1) {
                return {
                  label: value.name,
                  customerAccountId: value.id
                };
              }
            }));
          }, function(err) {
          });
        },
        select: function(event, ui) {
          // values are in ui.item
          $scope.prizes.customerAccountId = ui.item.customerAccountId;
        }
      }
    };

	}  // end of CreateChallengeController

})(window, window.angular);