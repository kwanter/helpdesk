var app = angular.module('app');

app.controller('progressCtrl',['$scope','$http','TicketService','DataService', function($scope,$http,TicketService,DataService){
    $scope.submit = submit;
    $scope.id_ticket = ''; 
    var id = DataService.get();

    $scope.init = function () {
        TicketService.getProgress(id)
            .then(
                function (d) {
                    $scope.slider.value = d['progress'];
                },
                function (errResponse) {
                    console.error('Error while fetching tickets : ' + errResponse);
                }
            );
    }

    $scope.slider = {
        value: 0,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            minLimit: 0,
            maxLimit: 100,
            showSelectionBar: true
        }
    };

    function submit(){
        var ticket = {
            'progress': {
                'id_ticket' : id,
                'stat'    : 'P',
                'progress'  : $scope.slider.value,
            }
        };
        
        update(ticket);
        alert('Ticket With ' + id + ' Progress Has Been Updated');
        console.log('Ticket progress updated with id ', id);
    }

    function update(ticket) {
        TicketService.updateProgress(ticket)
            .then(
                reset,
                function (errResponse) {
                    console.error('Error while updating ticket progress : ' + errResponse);
                }
            );
    }

    function reset(){
        $state.go($state.$current, null, { reload: true });
    }

}]);