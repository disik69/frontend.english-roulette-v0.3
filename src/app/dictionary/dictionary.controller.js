(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryController', DictionaryController);

    /** @ngInject */
    function DictionaryController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $timeout, $uibModal, fillArray)
    {
        var exercise = Restangular.all('exercise');
        var dictionaryPaginationPreloader = angular.element('.dictionary-pagination-preloader');
        var dictionaryWordQueryPreloader = angular.element('.dictionary-word-query-preloader');
        var page = 1;
        var lastPage = 1;
        var limit = 30;

        var loadFirstExercisePage = function (preloaderElement) {
            preloader.set(preloaderElement);
            page = 1;
            $scope.exerciseListEmpty = false;

            exercise.getList({search: $scope.wordQuery}, {'Page': page, 'Limit': limit}).then(
                function (response) {
                    $scope.exercises = response.data;

                    $scope.selectedExercises = fillArray(response.data.length, false);

                    lastPage = response.headers('Last-Page');
                    $scope.exerciseListEmpty = false;
                },
                function () {
                    $scope.exercises = [];
                    $scope.selectedExercises = [];
                    $scope.exerciseListEmpty = true;
                }
            ).finally(
                function () {
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
            callback: lockedCallback(function () {
                if (wordQueryWatcher.enabled) {
                    wordQueryWatcher.callback.lock = true;

                    $timeout(function () {
                        loadFirstExercisePage(dictionaryWordQueryPreloader);
                        wordQueryWatcher.callback.lock = false;
                    }, 500);
                } else {
                    wordQueryWatcher.enabled = true;
                }
            })
        };

        var loadNextExercisePage = lockedCallback(function () {
            if (page + 1 <= lastPage) {
                loadNextExercisePage.lock = true;
                page++;
                preloader.set(dictionaryPaginationPreloader);

                exercise.getList({search: $scope.wordQuery}, {'Page': page, 'Limit': limit}).then(
                    function (response) {
                        $scope.exercises = $scope.exercises.concat(response.data);

                        $scope.selectedExercises = $scope.selectedExercises.concat(fillArray(response.data.length, false));
                    }
                ).finally(function () {
                    loadNextExercisePage.lock = false;
                });
            }
        });

        var reloadExercise = function (index) {
            preloader.off();

            $scope.exercises[index].get().then(
                function (response) {
                    $scope.exercises[index] = response.data;
                }
            );
        };

        var reloadFirstExercisePage = function () {
            wordQueryWatcher.enabled = false;
            $scope.wordQuery = '';
            $scope.exercises = [];
            loadFirstExercisePage(dictionaryPaginationPreloader);
        };

        $rootScope.$on('endDocumentScroll', function () {
            loadNextExercisePage.execute();
        });

        $rootScope.$on('documentScroll', function (event, scroll) {
            var $ = angular.element;
            var $dictionaryWordQuery = $('.dictionary-word-query');

            if (scroll >= $('nav').innerHeight()) {
                $dictionaryWordQuery.addClass('dictionary-word-query-fixed container');
            } else {
                $dictionaryWordQuery.removeClass('dictionary-word-query-fixed container');
            }
        });

        $scope.changeTranslation = function (index) {
            $scope.currentExercise = $scope.exercises[index];

            var translationModal = $uibModal.open({
                size: 'sm',
                scope: $scope,
                animation: false,
                templateUrl: 'app/dictionary/dictionary.translation.html',
                controller: 'DictionaryTranslationController',
                backdropClass: 'custom-modal-backdrop'
            });

            translationModal.rendered.finally(
                function () {
                    $scope.dictionaryTranslationPreloader = angular.element('.dictionary-translation-preloader');

                    preloader.set($scope.dictionaryTranslationPreloader);
                }
            );

            translationModal.closed.finally(
                function () {
                    delete $scope.currentExercise;
                }
            );
        };

        $scope.createExercise = function () {
            if ($scope.wordQuery) {
                var wordModal = $uibModal.open({
                    size: 'lg',
                    scope: $scope,
                    animation: false,
                    templateUrl: 'app/dictionary/dictionary.word.html',
                    controller: 'DictionaryWordController',
                    backdropClass: 'custom-modal-backdrop'
                });

                wordModal.rendered.finally(
                    function () {
                        $scope.dictionaryWordPreloader = angular.element('.dictionary-word-preloader');

                        preloader.set($scope.dictionaryWordPreloader);
                    }
                );

                wordModal.result.finally(reloadFirstExercisePage);
            }
        };

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

                    reloadExercise(index)
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

        $scope.keyupWordQueryField = function (event) {
            switch (event.keyCode) {
                case 13:
                    $scope.createExercise();
                    break;

                case 27:
                    if ($scope.wordQuery) {
                        reloadFirstExercisePage();
                    }
            }
        };

        // for firefox
        angular.element('[ng-model="wordQuery"]').on('keydown', function (event) {
            if ((event.keyCode === 27) && (! $scope.wordQuery)) {
                return false;
            }
        });

        $scope.exercises = [];
        $scope.selectedExercises = [];
        $scope.exerciseListEmpty = false;
        $scope.allExercisesSelected = false;
        $scope.groupActionMenuShowed = false;

        loadFirstExercisePage(dictionaryPaginationPreloader);

        $scope.$watch('wordQuery', wordQueryWatcher.callback.execute);
        $scope.$watch('allExercisesSelected', allExercisesSelectedWatcher);
        $scope.$watchCollection('selectedExercises', selectedExercisesWatcher);
    }
})();