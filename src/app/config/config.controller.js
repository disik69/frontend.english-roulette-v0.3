(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('ConfigController', ConfigController);

    /** @ngInject */
    function ConfigController($scope, backendUrl, $log, resetForm, $http, $localStorage, $state, Restangular, lockedCallback, passport)
    {
        var user = Restangular.one('user', passport.id);
        var backupUser = {};

        var userWatcher = function (newValue) {
            for (var i in newValue) {
                if (newValue[i] !== backupUser[i]) {
                    $scope.userChanged = true;

                    return;
                }
            }

            $scope.userChanged = false;
        };

        $scope.user = {};
        $scope.userChanged = false;
        $scope.userId = passport.id;
        $scope.alerts = [];

        $scope.revert = function () {
            $scope.user = angular.copy(backupUser);

            $scope.configForm.$setPristine();
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.config = lockedCallback(function () {
            if ($scope.configForm.$valid) {
                if ($scope.userChanged) {
                    $scope.config.lock = true;

                    user.name = $scope.user.name;
                    user.email = $scope.user.email;
                    user.lesson_size = $scope.user.lessonSize;
                    user.reading_count = $scope.user.readingCount;
                    user.memory_count = $scope.user.memoryCount;
                    user.repeat_term = $scope.user.repeatTerm;

                    user.put().then(
                        function (response) {
                            backupUser = angular.copy($scope.user);
                            $scope.userChanged = false;
                            passport.name = $scope.user.name;

                            $scope.configForm.$setPristine();
                            $scope.alerts.push({type: 'success', msg: response.data});
                        },
                        function (response) {
                            for (var errorIndex in response.data.errors) {
                                $scope.alerts.push({type: 'danger', msg: response.data.errors[errorIndex]});
                            }
                        }
                    ).finally(
                        function () {
                            $scope.config.lock = false;
                        }
                    );
                } else {
                    $scope.alerts.push({type: 'warning', msg: 'There aren\'t any changes.'});
                }
            } else {
                $scope.alerts.push({type: 'warning', msg: 'Some or all fields are invalid.'});
            }
        });

        user.get().then(
            function (response) {
                $scope.user.name = response.data.name;
                $scope.user.email = response.data.email;
                $scope.user.lessonSize = response.data.lesson_size;
                $scope.user.readingCount = response.data.reading_count;
                $scope.user.memoryCount = response.data.memory_count;
                $scope.user.repeatTerm = response.data.repeat_term;

                backupUser = angular.copy($scope.user);

                $scope.$watchCollection('user', userWatcher);
            }
        );
    }
})();
