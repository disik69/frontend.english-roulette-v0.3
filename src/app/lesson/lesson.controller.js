(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('LessonController', LessonController);

    /** @ngInject */
    function LessonController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $timeout, $state, fillArray)
    {
        var state = $state.current.name;
        var exerciseParam = {};
        var exercise = Restangular.all('exercise');

        var currentExerciseWatcher = function (newValue) {
            if (newValue) {
                $scope.count = $scope.exercises.length;

                switch (state) {
                    case 'foreign-native':
                        $scope.repetitionAmount = newValue.reading;
                        $scope.leftSide.body = newValue.word + (newValue.position ? ' [' + newValue.ts + '] <em>' + newValue.position + '</em>' : '');
                        $scope.rightSide.body = newValue.translations.filter(function (item) {return item.used}).map(function (item) {return item.body}).join(', ');
                        break;

                    case 'native-foreign':
                        $scope.repetitionAmount = newValue.memory;
                        $scope.leftSide.body = newValue.translations.filter(function (item) {return item.used}).map(function (item) {return item.body}).join(', ');
                        $scope.rightSide.body = newValue.word + (newValue.position ? ' [' + newValue.ts + '] <em>' + newValue.position + '</em>' : '');
                        break;

                    case 'repetition':
                        $scope.leftSide.body = newValue.translations.filter(function (item) {return item.used}).map(function (item) {return item.body}).join(', ');
                        $scope.rightSide.body = newValue.word + (newValue.position ? ' [' + newValue.ts + '] <em>' + newValue.position + '</em>' : '');
                        break;
                }
            }
        };

        $scope.exercises = [];
        $scope.currentExercise = null;
        $scope.answerDisabled = true;
        $scope.playDisabled = true;
        $scope.nextDisabled = true;
        $scope.title = '';
        $scope.repetitionAmount = null;
        $scope.count = 0;
        $scope.leftSide = {
            body: '',
            word: false,
            translation: false
        };
        $scope.rightSide = {
            body: '',
            word: false,
            translation: false,
            success: false,
            error: false,
            invisible: true
        };

        switch (state) {
            case 'foreign-native':
                exerciseParam = {reading: true};
                $scope.leftSide.word = true;
                $scope.rightSide.translation = true;
                break;

            case 'native-foreign':
                exerciseParam = {memory: true};
                $scope.leftSide.translation = true;
                $scope.rightSide.word = true;
                break;

            case 'repetition':
                exerciseParam = {check: true};
                $scope.leftSide.translation = true;
                $scope.rightSide.word = true;
                break;
        }

        $scope.pushNextExercise = function () {
            $scope.rightSide.invisible = true;
            $scope.rightSide.success = false;
            $scope.rightSide.error = false;

            $scope.currentExercise = $scope.exercises.splice(Math.floor(Math.random() * $scope.exercises.length), 1)[0];

            $scope.playDisabled = false;
            $scope.nextDisabled = true;
        };

        $scope.stop = function () {
            $state.go('dictionary');
        };

        $scope.play = function () {
            $scope.playDisabled = true;
            $scope.answerDisabled = false;
            $scope.rightSide.invisible = false;
        };

        $scope.answer = lockedCallback(function (confirmation) {
            var result = null;

            $scope.answer.lock = true;

            switch (state) {
                case 'foreign-native':
                case 'native-foreign':
                    if (confirmation) {
                        preloader.off();
                        result = $scope.currentExercise.put({up: true}).then(
                            function () {
                                $scope.repetitionAmount--;
                                $scope.rightSide.success = true;
                            },
                            function () {
                                return $q.reject();
                            }
                        );
                    } else {
                        var fictionQuery = $q.defer();

                        result = fictionQuery.promise.then(
                            function () {
                                $scope.rightSide.error = true;
                            }
                        );

                        fictionQuery.resolve();
                    }

                    break;

                case 'repetition':
                    preloader.off();
                    if (confirmation) {
                        result = $scope.currentExercise.put({old: true}).then(
                            function () {
                                $scope.rightSide.success = true;
                            },
                            function () {
                                return $q.reject();
                            }
                        );
                    } else {
                        result = $scope.currentExercise.put({new: true}).then(
                            function () {
                                $scope.rightSide.error = true;
                            },
                            function () {
                                return $q.reject();
                            }
                        );
                    }

                    break;
            }

            result.then(
                function () {
                    $scope.answerDisabled = true;

                    if ($scope.exercises.length) {
                        $scope.nextDisabled = false;
                    }
                }
            ).finally(
                function () {
                    $scope.answer.lock = false;
                }
            );

        });

        exercise.getList(exerciseParam).then(
            function (response) {
                $scope.exercises = response.data;

                switch (state) {
                    case 'foreign-native':
                        $scope.title = 'Reading';
                        break;

                    case 'native-foreign':
                        $scope.title = 'Memory';
                        break;

                    case 'repetition':
                        $scope.title = 'Repetition';
                        break;
                }

                $scope.pushNextExercise();
            },
            function () {
                $scope.title = 'There aren\'t any exercises.'
            }
        );

        $scope.$watch('currentExercise', currentExerciseWatcher);
    }
})();