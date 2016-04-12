(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryController', DictionaryController);

    /** @ngInject */
    function DictionaryController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $timeout)
    {
        var exercises = Restangular.all('exercise');
        var dictionaryPreloader = angular.element('.dictionary-preloader');
        var page = 1;
        var lastPage = 1;
        var limit = 6;

        var wordWatcher = function (newValue) {
            preloader.set(dictionaryPreloader);
            page = 1;
            $scope.exercises = [];
            $scope.selectedExercises = [];
            $scope.exerciseListEmpty = false;
            $scope.allExercisesSelected = false;

            exercises.getList({search: newValue}, {'Page': page, 'Limit': limit}).then(
                function (response) {
                    $scope.exercises = response.data;
                    lastPage = response.headers('Last-Page');
                },
                function () {
                    $scope.exercises = [];
                    $scope.exerciseListEmpty = true;
                }
            );
        };

        var selectedExercisesWatcher = function (newValue) {
            $scope.groupActionMenuShowed = newValue.reduce(function (result, current) {
                return result || current;
            }, false);
        };

        var allExerciseSelectedWatcher = function (newValue) {
            for (var i = 0, size = $scope.selectedExercises.length; i < size; i++) {
                $scope.selectedExercises[i] = newValue;
            }
        };

        var loadExercisePage = lockedCallback(function () {
            if (page + 1 <= lastPage) {
                loadExercisePage.lock = true;
                page++;
                preloader.set(dictionaryPreloader);

                exercises.getList({search: $scope.word}, {'Page': page, 'Limit': limit}).then(
                    function (response) {
                        $scope.exercises = $scope.exercises.concat(response.data);
                    }
                ).finally(function () {
                    loadExercisePage.lock = false;
                });
            }
        });

        $rootScope.$on('endDocumentScroll', function () {
            loadExercisePage.execute();
        });

        $scope.removeExercise = function (index) {
            preloader.off();

            return $scope.exercises[index].remove().then(
                function () {
                    $scope.exercises.splice(index, 1);
                    $scope.selectedExercises.splice(index, 1);

                    if ($scope.exercises.length == 0) {
                        $scope.exerciseListEmpty = true;
                    }
                }
            );
        };

        $scope.changeExerciseStatus = function (index, params) {
            preloader.off();

            return $scope.exercises[index].put(params).then(
                function (response) {
                    $scope.selectedExercises[index] = false;

                    preloader.off();
                    $scope.exercises[index].get().then(
                        function (response) {
                            $scope.exercises[index] = response.data;
                        }
                    );
                }
            );
        };

        $scope.removeExerciseChain = function (promise) {
            if (! promise) {
                for (var i = 0, size = $scope.selectedExercises.length; i < size; i++) {
                    if ($scope.selectedExercises[i]) {
                        $scope.removeExerciseChain($scope.removeExercise(i));

                        break;
                    }
                }
            } else {
                promise = promise.then(
                    function () {
                        $scope.removeExerciseChain(promise);

                        for (var i = 0, size = $scope.selectedExercises.length; i < size; i++) {
                            if ($scope.selectedExercises[i]) {
                                return $scope.removeExercise(i);
                            }
                        }

                        $scope.allExercisesSelected = false;

                        return $q.reject();
                    }
                );
            }
        };

        $scope.changeExerciseStatusChain = function (promise, params) {
            if (! promise) {
                for (var i = 0, size = $scope.selectedExercises.length; i < size; i++) {
                    if ($scope.selectedExercises[i]) {
                        $scope.changeExerciseStatusChain($scope.changeExerciseStatus(i, params), params);

                        break;
                    }
                }
            } else {
                promise = promise.then(
                    function () {
                        $scope.changeExerciseStatusChain(promise, params);

                        for (var i = 0, size = $scope.selectedExercises.length; i < size; i++) {
                            if ($scope.selectedExercises[i]) {
                                return $scope.changeExerciseStatus(i, params);
                            }
                        }

                        $scope.allExercisesSelected = false;

                        return $q.reject();
                    }
                );
            }
        };

        $rootScope.$on('documentScroll', function (event, scroll) {
            var $ = angular.element;
            var $dictionaryWord = $('.dictionary-word');

            if (scroll >= $('nav').innerHeight()) {
                $dictionaryWord.addClass('dictionary-word-fixed');
            } else {
                $dictionaryWord.removeClass('dictionary-word-fixed');
            }
        });

        $scope.exercises = [];
        $scope.selectedExercises = [];
        $scope.exerciseListEmpty = false;
        $scope.allExercisesSelected = false;
        $scope.groupActionMenuShowed = false;

        $scope.$watch('word', wordWatcher);
        $scope.$watch('allExercisesSelected', allExerciseSelectedWatcher);
        $scope.$watchCollection('selectedExercises', selectedExercisesWatcher);
    }
})();