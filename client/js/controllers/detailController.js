var app = angular.module("app");

app.controller('DetailController',['$scope','DataService','TicketService','PicService','CategoryService','$location','$log', 
    function ($scope, DataService,TicketService,PicService,CategoryService,$location,$log){
        //$scope.id_ticket = JSON.stringify(DataService.get());
        $scope.id_ticket = DataService.get();
        $scope.ticket = { 
            id_ticket: null, 
            id_category:'',
            id_pic:'',
            id_user: '', 
            username : '',
            problem: '', 
            attachment: '', 
            progress: '', 
            stat: '', 
            created_date: '', 
            created_by: '' 
        };
        $scope.pic = [];
        $scope.category = [];
        $scope.cancel = cancel;
        $scope.submit = submit;

        function submit() {
            $log.log('Editing Ticket.'); // kinda console logs this statement
            $log.log(JSON.stringify($scope.ticket));

            var ticket = {
                'ticket': {
                    'id_ticket': $scope.ticket.id_ticket,
                    'problems': $scope.ticket.problems,
                    'attachment': $scope.ticket.attachment,
                    'id_category': $scope.ticket.id_category,
                    'id_user': $scope.ticket.id_user,
                    'id_pic': $scope.ticket.id_pic,
                    'stat': $scope.ticket.stat,
                    'progress': $scope.ticket.progress,
                    'created_date': $scope.ticket.created_date,
                    'created_by': $scope.ticket.created_by
                }
            };
            $log.log(JSON.stringify(ticket));
            updateTicket(ticket);
        }

        getTicket();

        function reset() {
            $state.go($state.$current, null, { reload: true });
        }

        function cancel(){
            $location.path('/dashboard');
        }

        function updateTicket(ticket) {
            TicketService.updateTicket(ticket)
                .then(
                    reset,
                    function (errResponse) {
                        console.error('Error while updating ticket : '+ errResponse);
                    }
                );
        }

        function getTicket(){
            TicketService.getTicket($scope.id_ticket)
                .then(
                    function (d) {
                        $scope.ticket = d;
                        getPics();
                        getCat();
                    },
                    function (errResponse) {
                        console.error('Error while fetching tickets : '+ errResponse);
                    }
                );
        }

        var onFetchError = function (message) {
            $scope.error = "Error Fetching Users. Message:" + message;
        };

        var onFetchCompleted = function (data) {
            $scope.pic = data;
        };

        var getPics = function () {
            PicService.getPic().then(onFetchCompleted, onFetchError);
        };

        var getCat = function(){
            CategoryService.getCategory().then(onFetchCompletedCat, onFetchErrorCat);
        }

        var onFetchErrorCat = function (message) {
            $scope.error = "Error Fetching Users. Message:" + message;
        };

        var onFetchCompletedCat = function (data) {
            $scope.category = data;
        };

    }]);