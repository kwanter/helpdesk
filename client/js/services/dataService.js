var app = angular.module('app');
app.factory('DataService', function () {
    var savedData = {}

    function set(data) {
        //savedData = data;
        localStorage.setItem(savedData,data);
    }
    function get() {
        //return savedData;
        return localStorage.getItem(savedData);
    }

    return {
        set: set,
        get: get
    }
});