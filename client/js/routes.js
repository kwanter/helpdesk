angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/dashboard');
  $urlRouterProvider.otherwise('/dashboard_user');

  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: true
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
    
  })
  .state('app.ticket', {
      url: '/ticket',
      templateUrl: 'views/ticket.html',
      ncyBreadcrumb: {
        label: 'Ticket Information For Moderator & PIC',
      },
      params: { subtitle: 'Welcome to Ticket Information Page' },
  })
  .state('app.detail', {
    url: '/detail',
    templateUrl: 'views/detail.html',
    ncyBreadcrumb: {
      label: 'Ticket Information For User',
    },
    params: { subtitle: 'Welcome to Ticket Information Page' },
  })
    .state('app.main_user', {
      url: '/dashboard_user',
      templateUrl: 'views/main_user.html',
      ncyBreadcrumb: {
        label: 'Dashboard User',
      },
      params: { subtitle: 'Welcome to Ticket Information Page' },
    })
    .state('app.not_login', {
      url: '/not_login',
      ncyBreadcrumb: {
        label: 'Not Authenticated',
      },
      templateUrl: 'views/pages/not_login.html'
    })
  .state('appSimple', {
    abstract: true,
    templateUrl: 'views/common/layouts/simple.html',
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Font Awesome',
          files: ['modules/font-awesome/css/font-awesome.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
    }
  })
  // Additional Pages
  .state('appSimple.login', {
    url: '/login',
    templateUrl: 'views/pages/login.html'
  })
  .state('appSimple.register', {
    url: '/register',
    templateUrl: 'views/pages/register.html'
  })
  .state('appSimple.404', {
    url: '/404',
    templateUrl: 'views/pages/404.html'
  })
  .state('appSimple.500', {
    url: '/500',
    templateUrl: 'views/pages/500.html'
  })
}]);
