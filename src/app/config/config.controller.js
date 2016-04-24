(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('ConfigController', ConfigController);

    /** @ngInject */
    function ConfigController($scope, backendUrl, $log, resetForm, $http, $localStorage, $state, lockedCallback)
    {
        $log.debug('config');
    }
})();
