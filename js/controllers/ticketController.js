var app = angular.module("app");

app.controller('TicketController', ['$rootScope','$scope', 'TicketService','DataService', '$state','$location','$window','$localStorage',
    function ($rootScope,$scope,TicketService,DataService,$state,$location,$window,$log,$localStorage) {

    $scope.ticket = { 
        id_ticket       : null, 
        id_user         : '', 
        problem         : '', 
        id_category     : '',
        id_pic          : '',
        attachment      : '', 
        progress        : '', 
        stat            : '', 
        created_date    : '', 
        created_by      : ''
    };

    $scope.status_ticket = {
        jumlah_open         : 0,
        jumlah_progress     : 0,
        jumlah_confirmation : 0,
        jumlah_close        : 0,
        jumlah_cancel       : 0,
        jumlah_escalation   : 0,
        jumlah_seluruh      : 0
    };

    $scope.tickets = [];
    $scope.close = close;
    $scope.reset = reset;
    $scope.currentPage = 1;
    $scope.pageSize = 5;

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.width = function (value) {
        return { "width": value + "%" };
    }

    $scope.status = function(value){
        if(value == 'C')
            status = 'Completed';
        else
            status = 'Cancel';
        
        return status;
    }

    $scope.detail = function(d){
        DataService.set(d);
        $location.path('/ticket');
    }

    $scope.detail_user = function (d) {
        DataService.set(d);
        $location.path('/detail');
    }

    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };

    $scope.init = function () {
        if($rootScope.user.permissions == 'Moderator'){
            TicketService.getTicketStatus()
                .then(
                    function (data) {
                        $scope.status_ticket = data.response[0];
                    },
                    function (errResponse) {
                        console.error('Error while fetching tickets');
                    }
                );
        } 
        else if ($rootScope.user.permissions == 'PIC'){
            TicketService.getTicketStatus()
                .then(
                    function (data) {
                        $scope.status_ticket = data.response[0];
                    },
                    function (errResponse) {
                        console.error('Error while fetching tickets');
                    }
                );
        }
        else{
            TicketService.getTicketStatusByID($rootScope.user.id_user)
                .then(
                    function (data) {
                        $scope.status_ticket = data.response;
                    },
                    function (errResponse) {
                        console.error('Error while fetching tickets');
                    }
                );
        }
    }

    $scope.remove = function (d){
        if ($window.confirm("Yakin Ingin Meng-cancel Tiket " + d + " ?")) {
            TicketService.getTicket(d).then(
                function (r) {
                    $scope.ticket = r;
                    //alert(JSON.stringify($scope.ticket));
                    var ticket = {
                        'ticket': {
                            'id_ticket': d,
                            'problems': $scope.ticket['problems'],
                            'attachment': $scope.ticket['attachment'],
                            'id_category': $scope.ticket['id_category'],
                            'id_user': $scope.ticket['id_user'],
                            'id_pic': $scope.ticket['id_pic'],
                            'stat': 'Ca',
                            'progress': $scope.ticket['progress'],
                        }
                    };
                    //alert(JSON.stringify(ticket));

                    TicketService.closeTicket(ticket)
                        .then(
                            function (r) {
                                alert("Tiket Sudah Di Cancel");
                                reset();
                            },
                            function (errResponse) {
                                alert("Gagal Meng-close Tiket");
                                console.error('Error while closing ticket');
                            }
                        );
                },
                function (errResponse) {
                    alert('Gagal Mendapatkan Data Tiket ' + d);
                }
            );
        }
        else {
            alert('Batal Meng-close Tiket');
        } 
    }

    $scope.escalate = function (d) {
        if ($window.confirm("Yakin Ingin Meng-escalate Tiket " + d + " ?")) {
            TicketService.getTicket(d).then(
                function (r) {
                    $scope.ticket = r;
                    //alert(JSON.stringify($scope.ticket));
                    var ticket = {
                        'ticket': {
                            'id_ticket': d,
                            'problems': $scope.ticket['problems'],
                            'attachment': $scope.ticket['attachment'],
                            'id_category': $scope.ticket['id_category'],
                            'id_user': $scope.ticket['id_user'],
                            'id_pic': $scope.ticket['id_pic'],
                            'stat': 'E',
                            'progress': $scope.ticket['progress'],
                        }
                    };
                    //alert(JSON.stringify(ticket));

                    TicketService.closeTicket(ticket)
                        .then(
                            function (r) {
                                alert("Tiket Sudah Di Escalate");
                                reset();
                            },
                            function (errResponse) {
                                alert("Gagal Meng-escalate Tiket");
                                console.error('Error while closing ticket');
                            }
                        );
                },
                function (errResponse) {
                    alert('Gagal Mendapatkan Data Tiket ' + d);
                }
            );
        }
        else {
            alert('Batal Meng-close Tiket');
        }
    }

    $scope.return = function (d) {
        if ($window.confirm("Yakin Ingin Mengembalikan Tiket " + d + " Ke Status Progress?")) {
            TicketService.getTicket(d).then(
                function (r) {
                    $scope.ticket = r;
                    //alert(JSON.stringify($scope.ticket));
                    var ticket = {
                        'ticket': {
                            'id_ticket': d,
                            'problems': $scope.ticket['problems'],
                            'attachment': $scope.ticket['attachment'],
                            'id_category': $scope.ticket['id_category'],
                            'id_user': $scope.ticket['id_user'],
                            'id_pic': $scope.ticket['id_pic'],
                            'stat': 'P',
                            'progress': $scope.ticket['progress'],
                        }
                    };
                    //alert(JSON.stringify(ticket));

                    TicketService.closeTicket(ticket)
                        .then(
                            function (r) {
                                alert("Tiket Sudah Di Escalate");
                                reset();
                            },
                            function (errResponse) {
                                alert("Gagal Meng-escalate Tiket");
                                console.error('Error while closing ticket');
                            }
                        );
                },
                function (errResponse) {
                    alert('Gagal Mendapatkan Data Tiket ' + d);
                }
            );
        }
        else {
            alert('Batal Meng-close Tiket');
        }
    }

    $scope.cancel_close = function (d) {
        if ($window.confirm("Yakin Ingin Membatalkan Tiket " + d + " Ke Status Progress?")) {
            TicketService.getTicket(d).then(
                function (r) {
                    $scope.ticket = r;
                    //alert(JSON.stringify($scope.ticket));
                    var ticket = {
                        'ticket': {
                            'id_ticket': d,
                            'problems': $scope.ticket['problems'],
                            'attachment': $scope.ticket['attachment'],
                            'id_category': $scope.ticket['id_category'],
                            'id_user': $scope.ticket['id_user'],
                            'id_pic': $scope.ticket['id_pic'],
                            'stat': 'P',
                            'progress': 99,
                        }
                    };
                    //alert(JSON.stringify(ticket));

                    TicketService.closeTicket(ticket)
                        .then(
                            function (r) {
                                alert("Tiket Sudah Kembali Ke On Progress");
                                reset();
                            },
                            function (errResponse) {
                                alert("Gagal Meng-escalate Tiket");
                                console.error('Error while closing ticket');
                            }
                        );
                },
                function (errResponse) {
                    alert('Gagal Mendapatkan Data Tiket ' + d);
                }
            );
        }
        else {
            alert('Batal Meng-close Tiket');
        }
    }

    $scope.close = function (d){
        if ($window.confirm("Yakin Ingin Meng-close Tiket " + d + " ?")){
            TicketService.getTicket(d).then(
                function(r){
                    $scope.ticket = r;
                    //alert(JSON.stringify($scope.ticket));
                    var ticket = {
                        'ticket': {
                            'id_ticket': d,
                            'problems': $scope.ticket['problems'],
                            'attachment': $scope.ticket['attachment'],
                            'id_category': $scope.ticket['id_category'],
                            'id_user': $scope.ticket['id_user'],
                            'id_pic': $scope.ticket['id_pic'],
                            'stat': 'C',
                            'progress': $scope.ticket['progress'],
                        }
                    };
                    //alert(JSON.stringify(ticket));
                    
                    TicketService.closeTicket(ticket)
                        .then(
                            function (r) {
                                alert("Tiket Sudah Selesai");
                                reset();
                            },
                            function (errResponse) {
                                alert("Gagal Meng-close Tiket");
                                console.error('Error while closing ticket');
                            }
                        );
                },
                function(errResponse){
                    alert('Gagal Mendapatkan Data Tiket ' + d);
                }
            );
        }
        else{
            alert('Batal Meng-close Tiket');
        } 
    }

    findAllTickets();

    function findAllTickets() {
        TicketService.findAllTickets()
            .then(
                function (d) {
                    $scope.tickets = d;
                },
                function (errResponse) {
                    console.error('Error while fetching tickets');
                }
            );
    }

    function reset() {
        $state.go($state.$current, null, { reload: true, inherit: true, notify: true });
        //$route.reload();
    }

}]);