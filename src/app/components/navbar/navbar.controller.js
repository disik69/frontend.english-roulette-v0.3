(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController($scope, $log, passport, $state, $localStorage, $http, backendUrl)
    {
        $scope.passport = passport;
        $scope.minimizeCollapsed = true;

        $scope.switchMinimizeCollapse = function () {
            $scope.minimizeCollapsed = ! $scope.minimizeCollapsed;
        };

        $scope.isGuest = function () {
            return passport.hasRole('guest');
        };

        $scope.isUser = function () {
            return passport.hasRole('user');
        };

        $scope.isAdmin = function () {
            return passport.hasRole('admin');
        };

        $scope.signout = function () {
            $http({
                method: 'POST',
                url: backendUrl + '/signout',
                params: {token: $localStorage.accessToken}
            });

            delete $localStorage.accessToken;

            $state.go('signin');
        };
    }
})();