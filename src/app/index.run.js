(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $log, $state)
    {
        $rootScope.thisTime = Date.now();

        $rootScope.fireCollapseCycle = function () {
            $rootScope.$broadcast('collapseCycle');
        };

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            switch (error) {
                case 'guest':
                    $state.go('dictionary');
                    break;

                case 'user':
                    $state.go('signin');
                    break;

                case 'admin':
                    break;
            }
        });
    }
})();
