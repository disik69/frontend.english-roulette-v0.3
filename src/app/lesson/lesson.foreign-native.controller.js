(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('LessonForeignNativeController', LessonForeignNativeController);

    /** @ngInject */
    function LessonForeignNativeController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $timeout, $state, fillArray)
    {
        var exercise = Restangular.all('exercise');

        var currentExerciseWatcher = function (newValue) {
            if (newValue) {
                $scope.repetitionAmount = newValue.reading;

                preloader.off();
                exercise.getList({random_excluded_id: newValue.id}).then(
                    function (response) {
                        $scope.randomExercises = response.data;
                    }
                ).finally(
                    function () {
                        $scope.randomExercises.splice(Math.floor(Math.random() * $scope.randomExercises.length), 0, $scope.currentExercise);
                        $scope.selectedRandomExercises = fillArray($scope.randomExercises.length, false);
                    }
                );
            }
        };

        var selectedRandomExercisesWatcher = function (newValue, oldValue) {
            for (var i = 0, size = newValue.length; i < size; i++) {
                if (newValue[i] && (! oldValue[i])) {
                    $scope.selectedRandomExercises.forEach(function (item, index, array) {
                        if (index != i) {
                            array[index] = false;
                        }
                    });

                    $scope.answerDisabled = false;

                    break;
                } else if ((! newValue[i]) && oldValue[i]) {
                    $scope.answerDisabled = true;

                    break;
                }
            }
        };

        $scope.exercises = [];
        $scope.randomExercises = [];
        $scope.selectedRandomExercises = [];
        $scope.selectedRandomExerciseDisabled = false;
        $scope.currentExercise = null;
        $scope.answerDisabled = true;
        $scope.playActivated = false;
        $scope.nextDisabled = true;
        $scope.repetitionAmount = null;

        $scope.pushNextExercise = function () {
            $scope.currentExercise = $scope.exercises.splice(Math.floor(Math.random() * $scope.exercises.length), 1)[0];

            $scope.randomExercises = [];
            $scope.selectedRandomExercises = [];
            $scope.answerDisabled = true;
            $scope.selectedRandomExerciseDisabled = false;
            $scope.playActivated = false;

            if (! $scope.exercises.length) {
                $scope.nextDisabled = true;
            }
        };

        $scope.stop = function () {
            $state.go('dictionary');
        };

        $scope.play = lockedCallback(function () {
            $scope.play.lock = true;

            var result = false;

            for (var i = 0, size = $scope.selectedRandomExercises.length; i < size; i++) {
                if (
                    ($scope.selectedRandomExercises[i]) &&
                    ($scope.currentExercise.id === $scope.randomExercises[i].id)
                ) {
                    result = true;

                    break;
                }
            }

            if (result) {
                preloader.off();
                $scope.currentExercise.put({up: true}).then(
                    function () {
                        $scope.repetitionAmount--;
                        $scope.answerDisabled = true;
                        $scope.selectedRandomExerciseDisabled = true;
                        $scope.playActivated = true;
                    }
                ).finally(
                    function () {
                        $scope.play.lock = false;
                    }
                );
            } else {
                $scope.answerDisabled = true;
                $scope.selectedRandomExerciseDisabled = true;
                $scope.playActivated = true;
                $scope.play.lock = false;
            }
        });

        exercise.getList({reading: true}).then(
            function (response) {
                $scope.exercises = response.data;

                $scope.nextDisabled = false;
                $scope.pushNextExercise();
            },
            function () {
                $scope.title = 'There aren\'t exercises.'
            }
        );

        $scope.$watch('currentExercise', currentExerciseWatcher);
        $scope.$watchCollection('selectedRandomExercises', selectedRandomExercisesWatcher);
    }
})();