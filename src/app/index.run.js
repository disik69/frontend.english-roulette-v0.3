(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $log, $state, Restangular, $localStorage)
    {
        $rootScope.thisTime = Date.now();

        $rootScope.fireCollapseCycle = function () {
            $rootScope.$broadcast('collapseCycle');
        };

        angular.element(window).on('scroll', function () {
            var $ = angular.element;

            $rootScope.$broadcast('documentScroll', $(this).scrollTop());

            if ($(this).scrollTop() >= $(document).height() - $(this).height() - ($('footer').innerHeight() * 2)) {
                $rootScope.$broadcast('endDocumentScroll');
            }
        });

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

        Restangular.setFullResponse(true);

        Restangular.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {

            params = angular.merge(params, {token: $localStorage.accessToken});

            return {
                element: element,
                params: params,
                headers: headers,
                httpConfig: httpConfig
            }
        });
    }
})();
