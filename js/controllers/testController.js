var app = angular.module("app");

app.controller('TestController', ['$scope', 'TicketService', '$state',
    function ($scope, TicketService, $state) {
        $scope.datadummy = [];
        $scope.reset = reset;
        findAllDataDummy();

        function findAllDataDummy() {
            TicketService.findAllDataDummy()
                .then(
                    function (d) {
                        $scope.datadummy = d;
                    },
                    function (errResponse) {
                        console.error('Error while fetching tickets');
                    }
                );
        }

        function reset() {
            $state.go($state.$current, null, { reload: true, inherit: true, notify: true });
        }
    }]);