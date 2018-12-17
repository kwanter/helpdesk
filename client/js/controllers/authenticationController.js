var app = angular.module("app");

app.controller('AuthController', ['$scope', '$state','$sessionStorage','AuthenticationService','$location',
    function ($scope, $state,$sessionStorage, AuthenticationService,$location) {
        $scope.ip    = '192.168.0.0';
        $scope.login = login;
        $scope.reset = reset;
        $scope.init = start();

        function GetUserIP() {
            var ret_ip;
            var ip = self.location.host;
            $.ajaxSetup({ async: false });
            $.get('http://'+ip+'/helpdesk/api/ip', function (r) {
                ret_ip = r.ip;
            });
            $scope.ip = ret_ip;
        }

        function start(){
            GetUserIP();
            login();
            //console.log($sessionStorage.user.id_user);
            if($sessionStorage.user.permissions == 'User'){
                $location.path('/dashboard_user');
            } else if ($sessionStorage.user.permissions == 'PIC' || $sessionStorage.user.permissions == 'Moderator'){
                $location.path('/dashboard');
            } else{
                $location.path('/not_login');
            }
        }

        function reset() {
            $state.go($state.$current, null, { reload: true });
        }

        function login(){
           AuthenticationService.login($scope.ip)
            .then(
                function(response){
                    console.log('Login Success');
                    //console.log(JSON.stringify($sessionStorage.user));
                },
                function(errResponse){
                    console.log('Login Failed ' + $scope.ip);
                    $location.path('/not_login');
                    //console.log($sessionStorage.userSession);
                }
           );
        }
    }]);