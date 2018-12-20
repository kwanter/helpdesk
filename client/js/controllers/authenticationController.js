var app = angular.module("app");

app.controller('AuthController', ['$scope', '$state','$route','$localStorage','AuthenticationService','$location',
    function ($scope, $state, $route,$localStorage, AuthenticationService,$location) {
        $scope.ip    = '192.168.0.0';
        $scope.login = login;
        $scope.reset = reset;
        $scope.init = start();

        function GetUserIP() {
            var ip = self.location.host;
            $.ajaxSetup({ async: false });
            $.get('http://'+ip+'/helpdesk/api/ip', function (r) {
                $scope.ip = r.ip;
            });
            console.log('IP : ' + $scope.ip);
        }

        function start(){
            GetUserIP();
            login();
            //console.log($localStorage.user.id_user);
            //console.log($localStorage.user.ip_addr);
            if ($localStorage.user.permissions === 'PIC' || $localStorage.user.permissions === 'Moderator'){
                $location.path('/dashboard');
            }
            else if ($localStorage.user.permissions === 'User') {
                $location.path('/dashboard_user');
            } else{
                $location.path('/not_login');
            }  
        }

        function reset() {
            $state.go($state.$current, null, { reload: true, inherit: true, notify: true });
            //$route.reload();
        }

        function login(){
           AuthenticationService.login($scope.ip)
            .then(
                function(response){
                    //console.log('Autentikasi Sukses');
                    console.log(JSON.stringify($localStorage.user));
                },
                function(errResponse){
                    //console.log('Autentikasi Gagal ' + $scope.ip);
                    console.log($localStorage.user);
                    $location.path('/not_login');
                }
           );
        }
    }]);