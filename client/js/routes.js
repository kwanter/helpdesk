angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/dashboard');
  $urlRouterProvider.otherwise('/dashboard_user');
  $urlRouterProvider.otherwise('/not_login');
  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: false
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'app.main',
    includeAbstract: true,
    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
  });

  $stateProvider
  .state('app', {
    abstract: true,
    templateUrl: 'views/common/layouts/full.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Root',
      skip: true
    },
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Flags',
          files: ['modules/flag-icon-css/css/flag-icon.css']
        },{
          serie: true,
          name: 'Font Awesome',
          files: ['modules/font-awesome/css/font-awesome.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }]
    }
  })
  .state('app.main', {
    url: '/dashboard',
    templateUrl: 'views/main.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Dashboard',
    },
    //page subtitle goes here
    params: { subtitle: 'Welcome to IT Helpdesk Main Dashboard' },
    resolve: { authenticate: authenticate }
  })
  .state('app.ticket', {
      url: '/ticket',
      templateUrl: 'views/ticket.html',
      ncyBreadcrumb: {
        label: 'Ticket Information For Moderator & PIC',
      },
      params: { subtitle: 'Welcome to Ticket Information Page' },
      resolve: { authenticate: authenticate }
  })
  .state('app.detail', {
    url: '/detail',
    templateUrl: 'views/detail.html',
    ncyBreadcrumb: {
      label: 'Ticket Information For User',
    },
    params: { subtitle: 'Welcome to Ticket Information Page' },
    resolve: { authenticate: authenticate }
  })
  .state('app.main_user', {
    url: '/dashboard_user',
    templateUrl: 'views/main_user.html',
    ncyBreadcrumb: {
      label: 'User',
    },
    params: { subtitle: 'Welcome to Ticket Information Page' },
    resolve: { authenticate: authenticate }
  })
  .state('app.not_login', {
    url: '/not_login',
    ncyBreadcrumb: {
      label: 'Not Authenticated',
    },
    templateUrl: 'views/pages/not_login.html',
    //resolve: { authenticate: authenticate }
  })

  function authenticate($q, AuthenticationService, $state, $timeout) {
    if (AuthenticationService.isLoggedIn()) {
      // Resolve the promise successfully
      return $q.when()
    }
    else {
      // The next bit of code is asynchronously tricky.
      $timeout(function () {
        // This code runs after the authentication promise has been rejected.
        // Go to the log-in page
        $state.go('app.not_login');
        $state.defaultErrorHandler(function (error) {
          // This is a naive example of how to silence the default error handler.
          console.log(error);
        });
      })

      // Reject the authentication promise to prevent the state from loading
      return $q.reject()
    }
  }
}]);