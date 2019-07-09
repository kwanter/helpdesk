var app = angular.module('app');
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl, name) {
        var fd = new FormData();
        if(file){
            fd.append('file', file);
            fd.append('id_ticket', name);

            return $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined, 'Process-Data': false }
            }).then(function (response) {
                //console.log("Success");
                return response;
            }, function (err) {
                //console.log("Success!!!!");
                return err;
            });
        }
    }
}]);