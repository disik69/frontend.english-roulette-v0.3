(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('AdminController', AdminController);

    /** @ngInject */
    function AdminController($scope, backendUrl, $log, resetForm, $http, $localStorage, $state, lockedCallback)
    {
        $log.debug('admin');
    }
})();