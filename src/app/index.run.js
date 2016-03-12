(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $log)
    {
        $rootScope.$on('$stateChangeError', function () {
            $log.debug(arguments);
        });
    }
})();
