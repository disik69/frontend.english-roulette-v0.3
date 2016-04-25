(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .service('passport', Passport)
        .factory('notary', notary)
        .factory('porter', porter);

    /** @ngInject */
    function Passport()
    {
        this.id = 0;
        this.name = 'guest';
        this.roles = ['guest'];

        this.hasRole = function (role) {
            return this.roles.indexOf(role) !== -1;
        };
    }

    /** @ngInject */
    function notary(backendUrl, $http, $localStorage, passport, $log)
    {
        return function () {
            var notary = $http({
                method: 'GET',
                url: backendUrl + '/debug-token',
                params: {token: $localStorage.accessToken}
            });

            return notary.then(
                function (response) {
                    passport.id = response.data.id;
                    passport.name = response.data.name;
                    passport.roles = response.data.roles;

                    return response.data.roles;
                }
            );
        };
    }
    
    /** @ngInject */
    function porter(notary, $q)
    {
        return function (role) {
            return notary().then(
                function (roles) {
                    var deferred = $q.defer();

                    if (roles.indexOf(role) !== -1) {
                        deferred.resolve();
                    } else {
                        deferred.reject(role);
                    }

                    return deferred.promise;
                }
            );
        };
    }
})();