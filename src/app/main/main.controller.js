(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $log, test) {
        $log.info(test);
    }
})();
