var app = angular.module("app");

app.controller("modalTicketFormController",
    function ($scope, $uibModal,$log ,$http,$state,TicketService,$route) {
        $scope.date = new Date();
        $scope.user_list = {
            id_user : '',
            ip_address : '',
            username : '',
            role : '',
            role_name : ''
        };
        $scope.users_list = [];
        $scope.ticket = {
            problems    : '',
            attachment  : '',
            id_category : '',
            id_user     : '',
            id_pic      : '',
            stat        : 'O',
            progress    : '0',
            created_date  : '',
            created_by  : ''  
        };
        ip = self.location.host;
        url = 'http://'+ip+'/helpdesk/api/ticket';

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $('.overlay').hide();
        };

        function findAllUsers() {
            TicketService.findAllTickets()
                .then(
                    function (d) {
                        $scope.users_list = d;
                    },
                    function (errResponse) {
                        console.error('Error while fetching tickets');
                    }
                );
        }

        $scope.showForm = function () {
            $uibModal.open({
                templateUrl: 'modal-form.html', // loads the template
                backdrop: true, // setting backdrop allows us to close the modal window on clicking outside the modal window
                windowClass: 'modal', // windowClass - additional CSS class(es) to be added to a modal window template
                controller: function ($scope, $uibModalInstance, $log, ticket,$state,$localStorage,fileUpload) {
                    $scope.ticket = ticket;
                    $scope.submit = function () {
                        $log.log('Submiting ticket.'); // kinda console logs this statement
                        var data = {
                            "ticket": {
                                'problems': ticket.problems,
                                'attachment': ticket.attachment,
                                'id_category': ticket.id_category,
                                'id_user': $localStorage.user.id_user,
                                'id_pic': ticket.id_pic,
                                'stat': ticket.stat,
                                'progress': ticket.progress,
                                'created_date': ticket.created_date,
                                'created_by': ticket.created_by,
                                'user': $localStorage.user.user
                            }
                        };

                        var file = $scope.myFile;
                        console.log('file is ');
                        console.dir(file);
                        var uploadUrl = 'http://' + ip + '/helpdesk/api/upload';
                        
                        TicketService.createTicket(data).then(
                            function(r){
                                fileUpload.uploadFileToUrl(file, uploadUrl, r['id']);
                                alert('Tiket Berhasil Dibuat');
                                $uibModalInstance.dismiss('cancel');
                                //$state.go($state.$current, null, { reload: true });
                                $route.reload();
                            },
                            function(err){
                                console.log('Gagal Buat Tiket');
                            }
                        );
                    }
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        $('.overlay').hide();
                    };
                },
                resolve: {
                    ticket: function () {
                        $state.go($state.$current, null, { reload: true }); 
                        return $scope.ticket;
                    }
                }
            });//end of modal.open
        }; // end of scope.open function
});