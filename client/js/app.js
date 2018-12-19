// Default colors
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

var app = angular
.module('app', [
  'ui.router',
  'oc.lazyLoad',
  'ncy-angular-breadcrumb',
  'ui.bootstrap',
  'angularUtils.directives.dirPagination',
  'rzModule',
  'ngStorage',
  'ngResource',
  'AuthServices',
  'angular-loading-bar',
  'ngRoute'
])
.config(['cfpLoadingBarProvider', '$qProvider', function (cfpLoadingBarProvider, $qProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 1;
  $qProvider.errorOnUnhandledRejections(false);
}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$on('$stateChangeSuccess',function(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $rootScope.$state = $state;
  return $rootScope.$stateParams = $stateParams;
}]);

app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

app.run(['$rootScope', '$location', 'AuthenticationService', function ($rootScope, $location, AuthenticationService) {
  AuthenticationService.init();
  $rootScope.$on('$routeChangeStart', function (event, next) {
    if (!AuthenticationService.checkPermissionForView(next)) {
      event.preventDefault();
      $location.path("/not_login");
    }
  });
}]);

app.filter('startFrom', function () {
  return function (input, start) {
    start = +start; //parse to int
    return input.slice(start);
  }
});
