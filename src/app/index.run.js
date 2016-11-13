(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $log, $state, Restangular, $localStorage, passport, wavesEffect)
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
                    if (passport.hasRole('user')) {
                        $state.go('dictionary');
                    } else if (passport.hasRole('admin')) {
                        $state.go('admin');
                    }

                    break;

                case 'user':
                case 'admin':
                    $state.go('signin');
                    break;
            }
        });

        Restangular.setFullResponse(true);

        Restangular.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {

            params = angular.merge(params, {token: $localStorage.accessToken});

            return {
                element: element,
                params: params,
                headers: headers,
                httpConfig: httpConfig
            }
        });

        Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
            if (response.status === 401) {
                $state.go('signin');
            }
        });

        wavesEffect.init();
    }
})();
