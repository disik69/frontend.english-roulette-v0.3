(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('SigninController', SigninController);

    /** @ngInject */
    function SigninController($scope, $log, $http, backendUrl, $localStorage, $state, resetForm, lockedCallback, notary, passport)
    {
        $scope.alerts = [];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.signin = lockedCallback(function () {
            $scope.signin.lock = true;

            $http({
                method: 'POST',
                url: backendUrl + '/signin',
                data: $scope.sign
            }).then(
                function (response) {
                    $localStorage.accessToken = response.data.token;

                    notary().then(
                        function () {
                            if (passport.hasRole('user')) {
                                $state.go('dictionary');
                            } else if (passport.hasRole('admin')) {
                                $state.go('admin');
                            }
                        }
                    );
                },
                function (response) {
                    resetForm($scope.signinForm);

                    for (var errorIndex in response.data.errors) {
                        $scope.alerts.push({type: 'danger', msg: response.data.errors[errorIndex]});
                    }
                }
            ).finally(
                function () {
                    $scope.signin.lock = false;
                }
            );
        });
    }
})();