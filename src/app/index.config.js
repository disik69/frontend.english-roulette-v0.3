(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .config(config);

    /** @ngInject */
    function config($httpProvider, RestangularProvider)
    {
        RestangularProvider.setBaseUrl('http://localhost:8000');

        $httpProvider.interceptors.push(function ($log) {
            return {
                request: function (config) {
                    $log.debug('start ajax');
                    return config;
                },
                response: function (response) {
                    $log.debug('success ajax');
                    return response;
                },
                responseError: function (response) {
                    $log.debug('error ajax');
                    return response;
                }
            };
        });
    }
})();
