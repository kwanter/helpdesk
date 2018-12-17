angular.module('app')
    .directive('permission', ['AuthenticationService', function (AuthenticationService) {
        return {
            restrict: 'A',
            scope: {
                permission: '='
            },

            link: function (scope, elem, attrs) {
                scope.$watch(AuthenticationService.isLoggedIn, function () {
                    if (AuthenticationService.userHasPermission(scope.permission)) {
                        elem.show();
                    } else {
                        elem.hide();
                    }
                });
            }
        }
    }]);