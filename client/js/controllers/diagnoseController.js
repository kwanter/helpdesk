var diagnose = angular.module('app');
diagnose.controller('DiagnoseCtrl', ['$scope', '$http', '$q', '$state', 'DataService', 'TicketService', function ($scope, $http, $q, $state, DataService, TicketService) {
    var ip = self.location.host;
    var url = 'http://'+ip+'/helpdesk/api/';
    $scope.id_ticket = DataService.get();
    $scope.urlListMessages = url + 'diagnose/' + $scope.id_ticket;
    $scope.urlListOnlines = url + 'diagnose/' + $scope.id_ticket;
    $scope.reset = reset;
    $scope.pidMessages = null;
    $scope.pidPingServer = null;

    $scope.messages = [];
    $scope.online = null;
    $scope.lastMessageId = null;
    $scope.historyFromId = null;

    $scope.me = {
        username: null,
        message: null
    };

    $scope.pageTitleNotificator = {
        vars: {
            originalTitle: window.document.title,
            interval: null,
            status: 0
        },
        on: function (title, intervalSpeed) {
            var self = this;
            if (!self.vars.status) {
                self.vars.interval = window.setInterval(function () {
                    window.document.title = (self.vars.originalTitle == window.document.title) ?
                        title : self.vars.originalTitle;
                }, intervalSpeed || 500);
                self.vars.status = 1;
            }
        },
        off: function () {
            window.clearInterval(this.vars.interval);
            window.document.title = this.vars.originalTitle;
            this.vars.status = 0;
        }
    };

    function saveDiagnose(data) {
        TicketService.saveDiagnose(data)
            .then(
                reset,
                function (errResponse) {
                    console.error('Error while saving solution : ' + errResponse);
                }
            );
    }

    $scope.saveDiagnose = function () {
        //var data = $.param($scope.me);
        var data = {
            'message': {
                'id_ticket'   : $scope.id_ticket,
                'str_diagnose': $scope.me.diagnose,
                'user'        : $scope.user.id_user
            }
        }
        saveDiagnose(data);
    };

    $scope.getLastMessage = function () {
        return $scope.messages[$scope.messages.length - 1];
    };

    $scope.listMessages = function (wasListingForMySubmission) {
        var deferred = $q.defer();
        $http.get($scope.urlListMessages).then(function (response) {
            /*
            $scope.messages = [];
            angular.forEach(data, function (message) {
                //message.str_solution = $scope.replaceShortcodes(message.str_solution);
                this.push(message);
                console.log(message);
            },$scope.messages);
            */
            deferred.resolve(response.data);
            var lastMessage = $scope.getLastMessage();
            var lastMessageId = lastMessage && lastMessage.id;

            if ($scope.lastMessageId !== lastMessageId) {
                $scope.onNewMessage(wasListingForMySubmission);
            }
            $scope.lastMessageId = lastMessageId;
        }, function (errResponse) {
            console.error('Error while fetching ticket');
            deferred.reject(errResponse);
        });
        return deferred.promise;
    };

    $scope.onNewMessage = function (wasListingForMySubmission) {
        if ($scope.lastMessageId && !wasListingForMySubmission) {
            //$scope.playAudio();
            $scope.pageTitleNotificator.on('New message');
            $scope.notifyLastMessage();
        }

        $scope.scrollDown();
        window.addEventListener('focus', function () {
            $scope.pageTitleNotificator.off();
        });
    };

    function reset() {
        $state.go($state.$current, null, { reload: true });
    }

    $scope.getUser = function () {
        TicketService.getUser($scope.id_ticket)
            .then(
                function (d) {
                    $scope.user = d;
                },
                function (errResponse) {
                    console.error('Error');
                }
            );
    };

    $scope.init = function () {
        $scope.listMessages()
            .then(
                function (d) {
                    $scope.messages = d;
                },
                function (errResponse) {
                    console.error('Error');
                }
            );
        //$scope.pidMessages = window.setInterval($scope.listMessages, 3000);
        //$scope.pidPingServer = window.setInterval($scope.pingServer, 8000);
    };

    $scope.scrollDown = function () {
        var pidScroll;
        pidScroll = window.setInterval(function () {
            $('.direct-chat-messages').scrollTop(window.Number.MAX_SAFE_INTEGER * 0.001);
            window.clearInterval(pidScroll);
        }, 100);
    };

    $scope.getUser();
    $scope.init();

    $scope.replaceShortcodes = function (message) {
        var msg = '';
        msg = message.toString().replace(/(\[img])(.*)(\[\/img])/, "<img src='$2' />");
        msg = msg.toString().replace(/(\[url])(.*)(\[\/url])/, "<a href='$2'>$2</a>");
        return msg;
    };

    $scope.notifyLastMessage = function () {
        if (typeof window.Notification === 'undefined') {
            return;
        }
        window.Notification.requestPermission(function (permission) {
            var lastMessage = $scope.getLastMessage();
            if (permission == 'granted' && lastMessage && lastMessage.username) {
                var notify = new window.Notification(lastMessage.username + ' says:', {
                    body: lastMessage.message
                });
                notify.onclick = function () {
                    window.focus();
                };
                notify.onclose = function () {
                    $scope.pageTitleNotificator.off();
                };
                var timmer = setInterval(function () {
                    notify && notify.close();
                    typeof timmer !== 'undefined' && window.clearInterval(timmer);
                }, 10000);
            }
        });
    };

    $scope.pingServer = function (msgItem) {
        return $http.post($scope.urlListOnlines, {}).then(function (data) {
            $scope.online = data;
        });
    };

    $scope.clearHistory = function () {
        var lastMessage = $scope.getLastMessage();
        var lastMessageId = lastMessage && lastMessage.id;
        lastMessageId && ($scope.historyFromId = lastMessageId);
    };
}]);