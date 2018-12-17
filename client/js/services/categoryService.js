'use strict';

angular.module('app').factory('CategoryService', ['$http', '$q', function ($http, $q) {
    var ip = self.location.host;
    var REST_SERVICE_URI = 'http://'+ip+'/helpdesk/api/';

    var factory = {
        getCategory: getCategory
    };

    return factory;

    function getCategory() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI + 'category')
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    console.error('Error while fetching data');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }
}]);