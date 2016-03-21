(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .factory('passport', passport)
        .factory('notary', notary)
        .factory('porter', porter);

    /** @ngInject */
    function passport()
    {
        return {
            roles: ['guest']
        };
    }

    /** @ngInject */
    function notary(backendUrl, $http, $localStorage, passport, $log)
    {
        return {
            get: function () {
                var notary = $http({
                    method: 'GET',
                    url: backendUrl + '/debug-token',
                    params: {token: $localStorage.accessToken}
                });

                return notary.then(
                    function (response) {
                        passport.name = response.data.name;
                        passport.roles = response.data.roles;

                        return response.data.roles;
                    }
                );
            }
        };
    }
    
    /** @ngInject */
    function porter(notary, $q)
    {
        return {
            get: function (role) {
                return notary.get().then(
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
            }
        };
    }
})();