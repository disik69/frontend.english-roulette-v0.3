(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('SignupController', SignupController);

    /** @ngInject */
    function SignupController($scope, backendUrl, $log, resetForm, $http, $localStorage, $state, lockedCallback)
    {
        $scope.resetCaptchaSrc = function () {
            $scope.captchaSrc = backendUrl + '/captcha?r=' + Math.ceil((Math.random() * Math.pow(10, 10)));
        };

        $scope.resetCaptchaSrc();

        $scope.alerts = [];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.signup = lockedCallback(function () {
            if ($scope.signupForm.$valid) {
                $scope.signup.lock = true;

                $http({
                    method: 'POST',
                    url: backendUrl + '/signup',
                    data: $scope.user
                }).then(
                    function (response) {
                        $localStorage.accessToken = response.data.token;

                        $state.go('dictionary');
                    },
                    function (response) {
                        $scope.resetCaptchaSrc();

                        $scope.user.password = null;
                        $scope.signupForm.password.$setPristine();
                        $scope.user.captcha = null;
                        $scope.signupForm.captcha.$setPristine();
                        $scope.repeatedPassword = null;
                        $scope.signupForm['repeated-password'].$setPristine();

                        for (var errorIndex in response.data.errors) {
                            $scope.alerts.push({type: 'danger', msg: response.data.errors[errorIndex]});
                        }
                    }
                ).finally(
                    function () {
                        $scope.signup.lock = false;
                    }
                );
            } else {
                $scope.alerts.push({type: 'warning', msg: 'Some or all fields are invalid.'});
            }
        });
    }
})();
