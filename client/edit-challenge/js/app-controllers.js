'use strict';

/*files upload to this url(temp url for demonstrate)*/
var uploadUrl = 'data/upload.php';

/* Controller */
var controllers = angular.module('controllers', ['ui.bootstrap', 'duScroll']);

//Main Controller
controllers.controller("mainCtrl",
    function ($scope, $compile, $element, $modal, $document, $window, $timeout, $location, $anchorScroll, $upload, customerAccountsList) {

        /*detect if challenge map content is in html*/
        $scope.challengeMap = angular.element('.challenge-map');

        /*------------------------*/
        /* public browsing section*/
        /*------------------------*/

        /*public browsing inputs*/
        $scope.publicBrowsing = {
            challengeName: '',
            shortDescription: '',
            longDescription: '',
            complete: false
        };

        /*watch public browsing section*/
        $scope.$watch('publicBrowsing', function (newVal) {
            $scope.publicBrowsing.complete = ($scope.publicBrowsing.challengeName.trim() !== '' && $scope.publicBrowsing.shortDescription.trim() !== '' && $scope.publicBrowsing.longDescription.trim() !== '');
        }, true);


        /*------------------------*/
        /*  file browsing section */
        /*------------------------*/
        $scope.noFile = false;
        $scope.fileName= '';
        $scope.fileDesc= '';
        $scope.fileBrowsing = {
            uploadedFiles: [],
            complete: false
        };

        $scope.tempFile = {
            name: '',
            desc: '',
            size: '',
            type: ''
        };

        $scope.progress = 0;
        $scope.selectedFile = null;
        $scope.upload = [];
        $scope.uploading = false;

        /*file select*/
        $scope.onFileSelect = function ($files) {
            $scope.selectedFiles = [];
            $scope.progress = 0;
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] != null) {
                        $scope.upload[i].abort();
                    }
                }
            }


            $scope.upload = [];

            $scope.selectedFile = $files[0];
            $scope.fileName = $files[0].name;
        };

        /*start uploading*/
        $scope.doUpload = function (file) {
            if ($scope.fileName === '') {
                return;
            }
            $scope.uploading = true;
            $scope.upload = $upload.upload({
                url: uploadUrl,
                method: "POST",
                headers: {'my-header': 'my-header-value'},
                data: {
                    myModel: $scope.fileDesc
                },
                file: $scope.selectedFile,
                fileFormDataName: 'Description'
            });
            $scope.upload.then(function (response) {
                $timeout(function () {
                    $scope.tempFile.name = $scope.selectedFile.name;
                    if ($scope.selectedFile.size < 1024) {
                        $scope.tempFile.size = $scope.selectedFile.size + 'b';
                    } else if ($scope.selectedFile.size < 1024 * 1024) {
                        $scope.tempFile.size = parseInt($scope.selectedFile.size / 1024) + 'kb';
                    } else {
                        $scope.tempFile.size = parseInt($scope.selectedFile.size / (1024 * 1024)) + 'mb';
                    }
                    $scope.tempFile.type = $scope.tempFile.name.split('.')[$scope.tempFile.name.split('.').length - 1].toUpperCase();
                    $scope.tempFile.desc = $scope.fileDesc;
                    $scope.fileBrowsing.uploadedFiles.push(angular.copy($scope.tempFile));
                    $scope.uploading = false;
                    $scope.progress = 0;
                    $scope.fileDesc = '';
                    $scope.fileName = '';
                }, 100);
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        /*remove file*/
        $scope.removeFile = function (file) {
            var index = $scope.fileBrowsing.uploadedFiles.indexOf(file);
            $scope.fileBrowsing.uploadedFiles.splice(index, 1);
            if ($scope.fileBrowsing.uploadedFiles.length === 0) {
                $scope.fileBrowsing.complete = false;
            }
        };

        /*watch file browsing section*/
        $scope.$watch('fileBrowsing', function (newVal) {
            if ($scope.fileBrowsing.uploadedFiles.length > 0) {
                $scope.fileBrowsing.complete = true;
            }
        }, true);

        /*watch no-file*/
        $scope.changeNoFile = function(state){
            $scope.fileBrowsing.complete = state;
        };

        /*detect if leave file browsing section*/
        $document.on('scroll', function () {
            //var sectionTop = $('#section-3').offset().top;
            //if (sectionTop <= $document.scrollTop()) {
            //    $scope.fileBrowsing.complete = true;
            //}
            $scope.isFirstSection = $document.scrollTop() <= 130;
        });


        /*---------------------*/
        /* requirement section */
        /*---------------------*/
        $scope.requirements = {
            content: '',
            requirementList: [],
            complete: false
        };

        /*edit List Item*/
        $scope.addListItem = function () {
            if ($scope.requirements.content === '') {
                return
            }
            $scope.list = {
                desc: $scope.requirements.content,
                edit: false
            };
            $scope.requirements.requirementList.push(angular.copy($scope.list));
            $scope.requirements.content = '';
            if ($scope.requirements.requirementList.length > 0) {
                $scope.requirements.complete = true;
            }
        };

        /*delete List Item*/
        $scope.deleteListItem = function (item) {
            var index = $scope.requirements.requirementList.indexOf(item);
            $scope.requirements.requirementList.splice(index, 1);
            if ($scope.requirements.requirementList.length === 0) {
                $scope.requirements.complete = false;
            }
        };


        /*-----------*/
        /* Time line */
        /*-----------*/
        $scope.timeLine = {
            startDate: $scope.stdt,
            endDate: $scope.enddt,
            startTime: $scope.timeSelectedStart,
            endTime: $scope.timeSelectedEnd,
            dateDiff: $scope.dateDiff,
            complete: false
        };
        $scope.minDate = $scope.minDate ? null : new Date();
        $scope.stdt = new Date();
        $scope.stdt.setDate($scope.stdt.getDate() + 0);
        $scope.enddt = new Date();
        $scope.enddt.setDate($scope.enddt.getDate() + 10);

        /*open start calendar*/
        $scope.openStartCal = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.startOpened = true;
            $scope.endOpened = false;
        };

        /*end start calendar*/
        $scope.openEndCal = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = true;
            $scope.startOpened = false;
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

        /*selected time*/
        $scope.timeSelectedStart = '14:00:00';
        $scope.timeSelectedEnd = '14:00:00';

        /*set start time*/
        $scope.setStartTime = function (time) {
            $scope.timeSelectedStart = time.time;
        };
        /*set end time*/
        $scope.setEndTime = function (time) {
            $scope.timeSelectedEnd = time.time;
        };

        /*set end date*/
        $scope.$watch('stdt', function () {
            if ($scope.stdt > $scope.enddt) {
                $scope.enddt = angular.copy($scope.stdt);
            }
            $scope.differenceInDays();
            $scope.timeLine.complete = true;
        });

        /*watch end date*/
        $scope.$watch('enddt', function () {
            $scope.differenceInDays();
            $scope.timeLine.complete = true;
        });

        $timeout(function(){
            $scope.timeLine.complete = false;
        },50);

        /*get difference date*/
        $scope.differenceInDays = function () {

            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            var millisBetween = $scope.enddt.setHours(0,0,0,0) - $scope.stdt.setHours(0,0,0,0);
            var days = millisBetween / millisecondsPerDay;

            $scope.dateDiff = Math.floor(days);
        };


        /*---------------*/
        /* Prize section */
        /*---------------*/

        $scope.prizes = {
            placePrizes: $scope.placePrizes,
            complete: false
        };

        $scope.placePrizes = {
            places: [
                {
                    active: true,
                    prize: null
                }, {
                    active: true,
                    prize: null
                }, {
                    active: true,
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

        /*set Place prize*/
        $scope.setPlacePrize = function (place,index) {
            if(!$scope.placePrizes.places[index-1].active){
                return false;
            }
            place.active = true;
        };

        /*remove Place prize*/
        $scope.removePlacePrize = function (place,index) {
            if($scope.placePrizes.places[index+1].active){
                return false;
            }
            place.active = false;
            place.prize = null;
        };

        $scope.totalPrize = 0;
        /*watch prize change*/
        $scope.$watch('placePrizes', function () {
            $scope.totalPrize = 0;
            angular.forEach($scope.placePrizes.places, function (value, key) {
                if(value.prize!== null && value.prize!== ''){
                    $scope.totalPrize += parseInt(value.prize);
                }
            });
            $scope.prizes.complete = (!!($scope.totalPrize > 0 && $scope.placePrizes.places[0].prize > 0) && ($scope.customerAccountId != ''));

        }, true);


        $scope.customerAccountName = '';
        $scope.customerAccountId = '';
        $scope.$watch('customerAccountId', function () {
            $scope.prizes.complete = (!!($scope.totalPrize > 0 && $scope.placePrizes.places[0].prize > 0) && ($scope.customerAccountId != ''));
        }, true);

        /*customer account auto complete*/
        $scope.autoComplete = {
            options: {
                html: true,
                focusOpen: false,
                onlySelect: true,
                appendTo: '.customer-account-holder',
                position: {my: "left top", at: "left bottom", collision: "none"},
                source: function (request, response) {

                    //customerAccountsList
                    var promise = customerAccountsList.query();
                    promise.then(function (data) {
                        response($.map(data.source, function (value) {
                            console.log(value.name);
                            if (value.name.toLowerCase().indexOf($scope.customerAccountName.toLowerCase()) > -1) {
                                return {
                                    label: value.name,
                                    customerAccountId: value.id
                                };
                            }
                        }));
                    }, function (data) {
                    });
                },
                select: function( event, ui ) {
                    $scope.customerAccountId = ui.customerAccountId;
                }
            }
        };

    });
