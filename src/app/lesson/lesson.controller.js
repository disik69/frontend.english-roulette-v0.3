(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('LessonController', LessonController);

    /** @ngInject */
    function LessonController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $timeout, $state, fillArray)
    {
        var state = $state.current.name;
        var autocompleteSource = '';
        var exerciseParam = '';
        var exercise = Restangular.all('exercise');

        var autocompleteResultWatcher = function (newValue) {
            if (newValue) {
                $scope.answer = newValue.title;
            }
        };

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
        $scope.answer = '';
        $scope.answerDisabled = true;
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
                autocompleteSource = 'translation';
                exerciseParam = {reading: true};
                $scope.leftSide.word = true;
                $scope.rightSide.translation = true;
                break;

            case 'native-foreign':
                autocompleteSource = 'word';
                exerciseParam = {memory: true};
                $scope.leftSide.translation = true;
                $scope.rightSide.word = true;
                break;

            case 'repetition':
                autocompleteSource = 'word';
                exerciseParam = {check: true};
                $scope.leftSide.translation = true;
                $scope.rightSide.word = true;
                break;
        }

        $scope.autocomplete = {
            id: 'lesson-angucomplete',
            promise: function (autocomplete, timeoutPromise) {
                preloader.off();

                return Restangular.all(autocompleteSource).withHttpConfig({timeout: timeoutPromise}).getList({autocomplete: autocomplete}, {'Limit': 5});
            },
            error: function () {},
            placeholder: autocompleteSource,
            inputChanged: function (autocomplete) {
                $scope.answer = autocomplete;

                return autocomplete;
            },
            clearResults: function () {
                var answer = $scope.answer;

                $scope.$broadcast('angucomplete-alt:clearInput', $scope.autocomplete.id);
                $scope.$broadcast('angucomplete-alt:changeInput', $scope.autocomplete.id, answer);
            },
            clearInput: function () {
                $scope.$broadcast('angucomplete-alt:clearInput', $scope.autocomplete.id);
            }
        };

        $scope.pushNextExercise = function () {
            $scope.rightSide.invisible = true;
            $scope.rightSide.success = false;
            $scope.rightSide.error = false;

            $scope.currentExercise = $scope.exercises.splice(Math.floor(Math.random() * $scope.exercises.length), 1)[0];

            $scope.autocomplete.clearInput();
            $scope.answerDisabled = false;

            if (! $scope.exercises.length) {
                $scope.nextDisabled = true;
            }
        };

        $scope.stop = function () {
            $state.go('dictionary');
        };

        $scope.play = lockedCallback(function () {
            $scope.play.lock = true;

            switch (state) {
                case 'foreign-native':
                    var result = false;

                    for (var i = 0, size = $scope.currentExercise.translations.length; i < size; i++) {
                        if (
                            ($scope.currentExercise.translations[i].used) &&
                            ($scope.currentExercise.translations[i].body.toLowerCase() === $scope.answer.toLowerCase())
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
                                $scope.autocomplete.clearResults();
                                $scope.answerDisabled = true;
                                $scope.rightSide.success = true;
                                $scope.rightSide.invisible = false;
                            }
                        ).finally(
                            function () {
                                $scope.play.lock = false;
                            }
                        );
                    } else {
                        $scope.autocomplete.clearResults();
                        $scope.answerDisabled = true;
                        $scope.rightSide.error = true;
                        $scope.rightSide.invisible = false;
                        $scope.play.lock = false;
                    }

                    break;

                case 'native-foreign':
                    if ($scope.currentExercise.word.toLowerCase() === $scope.answer.toLowerCase()) {
                        preloader.off();
                        $scope.currentExercise.put({up: true}).then(
                            function () {
                                $scope.repetitionAmount--;
                                $scope.autocomplete.clearResults();
                                $scope.answerDisabled = true;
                                $scope.rightSide.success = true;
                                $scope.rightSide.invisible = false;
                            }
                        ).finally(
                            function () {
                                $scope.play.lock = false;
                            }
                        );
                    } else {
                        $scope.autocomplete.clearResults();
                        $scope.answerDisabled = true;
                        $scope.rightSide.error = true;
                        $scope.rightSide.invisible = false;
                        $scope.play.lock = false;
                    }

                    break;

                case 'repetition':
                    preloader.off();
                    if ($scope.currentExercise.word.toLowerCase() === $scope.answer.toLowerCase()) {
                        $scope.currentExercise.put({old: true}).then(
                            function () {
                                $scope.autocomplete.clearResults();
                                $scope.answerDisabled = true;
                                $scope.rightSide.success = true;
                                $scope.rightSide.invisible = false;
                            }
                        ).finally(
                            function () {
                                $scope.play.lock = false;
                            }
                        );
                    } else {
                        $scope.currentExercise.put({new: true}).then(
                            function () {
                                $scope.autocomplete.clearResults();
                                $scope.answerDisabled = true;
                                $scope.rightSide.error = true;
                                $scope.rightSide.invisible = false;
                            }
                        ).finally(
                            function () {
                                $scope.play.lock = false;
                            }
                        );
                    }

                    break;
            }
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

                $scope.nextDisabled = false;
                $scope.pushNextExercise();
            },
            function () {
                $scope.title = 'There aren\'t exercises.'
            }
        );

        $scope.$watch('autocomplete.result', autocompleteResultWatcher);
        $scope.$watch('currentExercise', currentExerciseWatcher);
    }
})();