(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryController', DictionaryController);

    /** @ngInject */
    function DictionaryController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $uibModal, $timeout)
    {
        var exercise = Restangular.all('exercise');
        var dictionaryPaginationPreloader = angular.element('.dictionary-pagination-preloader');
        var dictionaryWordQueryPreloader = angular.element('.dictionary-word-query-preloader');
        var page = 1;
        var lastPage = 1;
        var limit = 30;

        var reloadExerciseList = function (preloaderElement) {
            preloader.set(preloaderElement);
            page = 1;
            $scope.exerciseListEmpty = false;

            exercise.getList({search: $scope.wordQuery}, {'Page': page, 'Limit': limit}).then(
                function (response) {
                    $scope.exercises = response.data;
                    lastPage = response.headers('Last-Page');
                    $scope.exerciseListEmpty = false;
                },
                function () {
                    $scope.exercises = [];
                    $scope.exerciseListEmpty = true;
                }
            ).finally(
                function () {
                    $scope.selectedExercises = [];
                    $scope.allExercisesSelected = false;
                }
            );
        };

        var selectedExercisesWatcher = function (newValue) {
            $scope.groupActionMenuShowed = newValue.reduce(function (result, current) {
                return result || current;
            }, false);
        };

        var allExercisesSelectedWatcher = function (newValue) {
            for (var i = 0, size = $scope.selectedExercises.length; i < size; i++) {
                $scope.selectedExercises[i] = newValue;
            }
        };

        var wordQueryWatcher = {
            enabled: false,
            callback: function () {
                if (wordQueryWatcher.enabled) {
                    reloadExerciseList(dictionaryWordQueryPreloader);
                } else {
                    wordQueryWatcher.enabled = true;
                }
            }
        };

        var loadExercisePage = lockedCallback(function () {
            if (page + 1 <= lastPage) {
                loadExercisePage.lock = true;
                page++;
                preloader.set(dictionaryPaginationPreloader);

                exercise.getList({search: $scope.wordQuery}, {'Page': page, 'Limit': limit}).then(
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

        $rootScope.$on('documentScroll', function (event, scroll) {
            var $ = angular.element;
            var $dictionaryWordQuery = $('.dictionary-word-query');

            if (scroll >= $('nav').innerHeight()) {
                $dictionaryWordQuery.addClass('dictionary-word-query-fixed');
            } else {
                $dictionaryWordQuery.removeClass('dictionary-word-query-fixed');
            }
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

        $scope.createExercise = function () {
            if ($scope.wordQuery) {
                $uibModal.open({
                    size: 'lg',
                    scope: $scope,
                    animation: false,
                    templateUrl: 'app/dictionary/dictionary.word.html',
                    controller: 'DictionaryWordController',
                    backdropClass: 'custom-modal-backdrop'
                }).result.finally(
                    function () {
                        wordQueryWatcher.enabled = false;
                        $scope.wordQuery = '';
                        $scope.exercises = [];
                        reloadExerciseList(dictionaryPaginationPreloader);

                    }
                );
            }
        };

        $scope.exercises = [];
        $scope.selectedExercises = [];
        $scope.exerciseListEmpty = false;
        $scope.allExercisesSelected = false;
        $scope.groupActionMenuShowed = false;

        reloadExerciseList(dictionaryPaginationPreloader);

        $scope.$watch('wordQuery', wordQueryWatcher.callback);
        $scope.$watch('allExercisesSelected', allExercisesSelectedWatcher);
        $scope.$watchCollection('selectedExercises', selectedExercisesWatcher);
    }
})();