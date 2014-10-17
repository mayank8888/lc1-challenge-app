var directives = angular.module("directives", []);

//detect page scroll
directives.directive("scroll", function ($window) {
  return function (scope, element, attrs) {

    scope.map = 'map1';

    var w = angular.element($window);
    scope.panelTop = w.scrollTop();

    scope.pageHeight = angular.element('.ui-wrapper').height();

    if (scope.panelTop + w.height() >= scope.pageHeight) {
      scope.panelTop = scope.pageHeight - w.height();
    } else if (scope.panelTop < 130) {
      scope.panelTop = 130;
    }

    w.bind("scroll", function () {
      scope.pageHeight = angular.element('.ui-wrapper').height();
      if (this.pageYOffset + scope.windowHeight >= scope.pageHeight) {
        scope.panelTop = scope.pageHeight - scope.windowHeight;
        scope.position = "absolute";
      } else if (this.pageYOffset > 130) {
        scope.panelTop = 0;
        scope.position = "fixed";
      } else {
        scope.panelTop = 130;
        scope.position = "absolute";
      }

      scope.setChallengePanelHeightPosition();
      scope.$apply();
    });
  };
});

//Set Height
directives.directive('resize', function ($window) {
  return function (scope, element, attr) {

    scope.position = "absolute";
    scope.panelRight = 0;
    var w = angular.element($window);
    scope.$watch(function () {
      return {
        'h': w.height(),
        'w': w.width()
      };
    }, function (newValue, oldValue) {
      scope.windowHeight = newValue.h;

      scope.setChallengePanelHeightPosition = function () {

        if (scope.position === "absolute") {
          scope.panelRight = 0;
        } else {
          scope.panelRight = (newValue.w - 1024) / 2;
        }
        if (scope.panelRight < 0) {
          scope.panelRight = 0;
          scope.position = "absolute";
          scope.panelTop = w.scrollTop();
        }

        return {
          'height': newValue.h + 'px',
          'top': scope.panelTop + 'px',
          //'right': scope.panelRight + 'px',
          'position': scope.position
        };
      };

      scope.setWidth = function () {
        if ((newValue.h - 150) / 5 - 10 < 100) {
          return {
            'width': (newValue.h - 150) / 5 - 10 + 'px',
            'line-height': '14px',
            'max-height': '42px'
          };
        } else {
          return {
            'width': (newValue.h - 150) / 5 - 10 + 'px',
            'line-height': '18px',
            'max-height': '36px'
          };
        }
      };
      scope.setHeight = function () {
        return {
          'height': (newValue.h - 150) / 5 - 1 + 'px'
        };
      };
      scope.setSectionMinHeight = function () {
        return {
          'min-height': newValue.h + 'px'
        };
      };

    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  }
});

//max length
directives.directive('maxlength', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var maxlength = Number(attrs.maxlength);

      function fromUser(text) {
        if (text.length > maxlength) {
          var transformedInput = text.substring(0, maxlength);
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
          return transformedInput;
        }
        return text;
      }

      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});


/*numbers only*/
directives.directive('numbersOnly', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {
        // this next if is necessary for when using ng-required on your input.
        // In such cases, when a letter is typed first, this parser will be called
        // again, and the 2nd time, the value will be undefined
        if (inputValue == undefined) return '';
        var transformedInput = inputValue.replace(/[^0-9]/g, '');
        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }

        return transformedInput;
      });
    }
  };
});