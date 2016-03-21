(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .config(config);

    /** @ngInject */
    function config($httpProvider, RestangularProvider, backendUrl)
    {
        RestangularProvider.setBaseUrl(backendUrl);

        $httpProvider.interceptors.push(function ($log, $q, preloader) {
            return {
                request: function (config) {
                    preloader.show();
                    return config;
                },
                response: function (response) {
                    preloader.hide();
                    return response;
                },
                responseError: function (response) {
                    preloader.hide();
                    return $q.reject(response);
                }
            };
        });
    }
})();
