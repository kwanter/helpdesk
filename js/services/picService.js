'use strict';

angular.module('app').factory('PicService', ['$http', '$q', function ($http, $q) {
    var ip = self.location.host;
    var REST_SERVICE_URI = 'http://'+ip+'/helpdesk_api/';

    var factory = {
        getPic: getPic
    };

    return factory;

    function getPic() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'pic')
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