(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('SigninController', SigninController);

    /** @ngInject */
    function SigninController($scope, $log, $http, backendUrl, $localStorage, $state, resetForm, lockedCallback)
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

                    $state.go('dictionary');
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