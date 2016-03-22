(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController($scope, $log, passport, $state, $localStorage)
    {
        $scope.passport = passport;
        $scope.collapseCycle = true;
        $scope.minimizeCollapsed = true;

        $scope.switchMinimizeCollapse = function () {
            $scope.minimizeCollapsed = ! $scope.minimizeCollapsed;
        };

        $scope.isGuest = function () {
            return $scope.passport.roles.indexOf('guest') !== -1;
        };

        $scope.isUser = function () {
            return $scope.passport.roles.indexOf('user') !== -1;
        };

        $scope.isAdmin = function () {
            return $scope.passport.roles.indexOf('admin') !== -1;
        };

        $scope.signout = function () {
            delete $localStorage.accessToken;
            $state.go('signin');
        };

        $scope.switchCollapseCycle = function () {
            $scope.collapseCycle = ! $scope.collapseCycle;
        };
    }
})();