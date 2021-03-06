var app = angular.module("app");

app.controller("modalTicketFormController",
    function ($scope, $uibModal,$log ,$http,$state,TicketService,$route) {
        $scope.date = new Date();
        $scope.file_name = '';
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
        /*
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $('.overlay').hide();
        };
        */
        $scope.showForm = function () {
            $uibModal.open({
                templateUrl: 'modal-form.html', // loads the template
                backdrop: true, // setting backdrop allows us to close the modal window on clicking outside the modal window
                windowClass: 'modal', // windowClass - additional CSS class(es) to be added to a modal window template
                controller: function ($scope, $uibModalInstance, $log, ticket,$state,$localStorage,fileUpload) {
                    $scope.ticket = ticket;
                    $scope.submit = function (form) {
                        form.$setPristine();
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
                        var uploadUrl = 'http://' + ip + '/helpdesk_api/upload';
                        TicketService.createTicket(data).then(
                            function(r){
                                console.log('file is ');
                                console.log($scope.file_name);
                                console.dir(file);
                                if (file != 'undefined' || file != undefined){
                                    fileUpload.uploadFileToUrl(file, uploadUrl, r['id']);
                                }
                                alert('Tiket Berhasil Dibuat');
                                $uibModalInstance.dismiss('cancel');
                                $state.go($state.$current, null, { reload: true, inherit: true, notify: true });
                                //$state.forceReload();
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
                        return $scope.ticket;
                    }
                }
            }).result.catch(function () {  });//catch error unhandled rejection
        }; // end of scope.open function
});