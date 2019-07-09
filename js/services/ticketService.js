'use strict';

angular.module('app').factory('TicketService', ['$http', '$q', function ($http, $q) {
    var ip = self.location.host;
    var REST_SERVICE_URI = 'http://'+ip+'/helpdesk_api/';

    var factory = {
        findAllTickets: findAllTickets,
        findAllDataDummy: findAllDataDummy,
        getTicket   : getTicket,
        createTicket: createTicket,
        updateTicket: updateTicket,
        deleteTicket: deleteTicket,
        closeTicket : closeTicket,
        getProgress : getProgress,
        updateProgress : updateProgress,
        getUser : getUser,
        getUserAll: getUserAll,
        saveSolution : saveSolution,
        saveDiagnose : saveDiagnose,
        saveChat : saveChat,
        getTicketStatus : getTicketStatus,
        getTicketStatusByID: getTicketStatusByID
    };

    var config = {
        headers: {
            'Content-Type': 'application/json;'
        }
    }

    return factory;

    function findAllTickets() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'ticket')
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching tickets');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function findAllDataDummy() {
        var deferred = $q.defer();
        $http.get('http://2c687856.ngrok.io/slim1/public/allusers')
            .then(
                function (response) {
                    deferred.resolve(response.data.users);
                },
                function (errResponse) {
                    console.error('Error while fetching tickets');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getTicketStatus() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'status')
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching tickets');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getTicketStatusByID(id) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'status/' +id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching tickets');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getTicket(id) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'ticket/' +id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function saveSolution(data){
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI + 'solution', data)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while creating ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function saveDiagnose(data) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI + 'diagnose', data)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while creating ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function saveChat(data) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI + 'chat', data)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while creating ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function createTicket(ticket) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI + 'ticket', ticket)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while creating ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function updateTicket(ticket) {
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI + 'ticket', ticket)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while updating ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function deleteTicket(id) {
        var deferred = $q.defer();
        $http.delete(REST_SERVICE_URI + 'ticket/' + id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while canceling ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function closeTicket(ticket) {
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI + 'ticket' ,ticket,config)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while canceling ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getProgress(id) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'progress/' + id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function updateProgress(progress) {
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI + 'progress', progress)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while updating ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getUser(id) {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'user/' + id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getUserAll() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'user/')
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching ticket');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }
}]);