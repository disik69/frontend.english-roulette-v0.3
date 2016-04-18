(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryWordController', DictionaryWordController);

    /** @ngInject */
    function DictionaryWordController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $uibModalInstance, $q)
    {
        var word = Restangular.all('word');
        var translation = Restangular.all('translation');
        var exercise = Restangular.all('exercise');

        var unwatchSelectedWords = function () {};
        var selectedWordsWatcher = function (newValue, oldValue) {
            for (var i = 0, size = newValue.length; i < size; i++) {
                if (newValue[i].selected && (! oldValue[i].selected)) {
                    $scope.selectedWords.forEach(function (item, index, array) {
                        if (index != i) {
                            array[index].selected = false;
                        }
                    });

                    $scope.customWordEnabled = false;

                    break;
                } else if ((! newValue[i].selected) && oldValue[i].selected) {
                    $scope.selectedWords[i].selectedTranslations.forEach(function (item, index, array) {
                        array[index] = false;
                    });

                    break;
                }
            }
        };

        var unwatchCustomWordEnabled = function () {};
        var customWordEnabledWatcher = function (newValue) {
            if (newValue) {
                $scope.selectedWords.forEach(function (item, index) {
                    $scope.selectedWords[index].selected = false;
                });
            }
        };

        var createTranslations = function () {
            var translationCreatingPromises = [];

            $scope.customTranslations.forEach(function (item, index) {
                translationCreatingPromises.push(
                    translation.post({body: item}).then(
                        function (response) {
                            return response.data.id;
                        },
                        function () {
                            preloader.set($scope.dictionaryWordPreloader);

                            return translation.getList({body: item}).then(
                                function (response) {
                                    return response.data[0].id;
                                }
                            );
                        }
                    )
                );
            });

            preloader.set($scope.dictionaryWordPreloader);

            return $q.all(translationCreatingPromises);
        };

        var createWord = function () {
            return (createTranslations()).then(
                function (data) {
                   preloader.set($scope.dictionaryWordPreloader);

                   return word.post({body: $scope.wordQuery, translation_id: data[0]}).then(
                       function (response) {
                           var wordId = response.data.id;
                           var translationAddingPromises = [];

                           for (var i = 1, size = data.length; i < size; i++) {
                               translationAddingPromises.push(
                                   Restangular.one('word', wordId).all('translation').post({translation_id: data[i]})
                               );
                           }

                           preloader.set($scope.dictionaryWordPreloader);

                           return $q.all(translationAddingPromises).then(
                               function () {
                                   return {wordId: wordId, translationIds: data};
                               }
                           )
                       }
                   );
                }
            );
        };

        var createExercise = function () {
            var deferred = $q.defer();

            if ($scope.customWordEnabled) {
                (createWord()).then(
                    function (data) {
                        deferred.resolve(data);
                    },
                    function (data) {
                        deferred.reject('word');
                    }
                );
            } else {
                var reason = {wordId: 0, translationIds: []};

                for (var i = 0, size = $scope.selectedWords.length; i < size; i++) {
                    if ($scope.selectedWords[i].selected) {
                        reason.wordId = $scope.words[i].id;

                        $scope.selectedWords[i].selectedTranslations.forEach(function (item, index) {
                            if (item) {
                                reason.translationIds.push($scope.words[i].translations[index].id);
                            }
                        });

                        deferred.resolve(reason);

                        break;
                    }
                }
            }

            return deferred.promise.then(
                function (data) {
                    preloader.set($scope.dictionaryWordPreloader);

                    return exercise.post({word_id: data.wordId, translation_id: data.translationIds[0]}).then(
                        function (response) {
                           var exerciseId = response.data.id;
                           var translationAddingPromises = [];

                           for (var i = 1, size = data.translationIds.length; i < size; i++) {
                               translationAddingPromises.push(
                                   Restangular.one('exercise', exerciseId).all('translation').post({translation_id: data.translationIds[i]}).then(
                                       function () {}, function () {}
                                   )
                               );
                           }

                           preloader.set($scope.dictionaryWordPreloader);

                           return $q.all(translationAddingPromises);
                        },
                        function () {
                            return $q.reject('exercise');
                        }
                    );
                }
            );
        };

        var reloadWords = function () {
            preloader.set($scope.dictionaryWordPreloader);

            return word.getList({body: $scope.wordQuery}).then(
                function (response) {
                    response.data.forEach(function (item, index) {
                        var selectedWord = {selected: false, selectedTranslations: []};

                        item.translations.forEach(function (item, index) {
                            selectedWord.selectedTranslations[index] = false;
                        });

                        $scope.selectedWords[index] = selectedWord;
                    });

                    unwatchSelectedWords = $scope.$watch('selectedWords', selectedWordsWatcher, true);
                    unwatchCustomWordEnabled = $scope.$watch('customWordEnabled', customWordEnabledWatcher);

                    $scope.words = response.data;
                },
                function () {}
            ).finally(
                function () {
                    preloader.hideForcibly();
                }
            );
        };

        $scope.words = [];
        $scope.selectedWords = [];
        $scope.customTranslations = [];
        $scope.customWordEnabled = false;

        $scope.addCustomTranslation = function () {
            if (
                $scope.customTranslationRaw &&
                ($scope.customTranslations.indexOf($scope.customTranslationRaw) == -1)
            ) {
                $scope.customTranslations.push($scope.customTranslationRaw);
                $scope.customTranslationRaw = '';
            }
        };

        $scope.keyupAddCustomTranslation = function (event) {
            if (event.keyCode == 13) {
                $scope.addCustomTranslation();
            }
        };

        $scope.removeCustomTranslation = function (index) {
            $scope.customTranslations.splice(index, 1);
        };

        $scope.createExercise = lockedCallback(function () {
            $scope.createExercise.lock = true;

            (createExercise()).then(
                function () {
                    $uibModalInstance.close();
                },
                function (data) {
                    if (data === 'exercise') {
                        unwatchSelectedWords();
                        unwatchCustomWordEnabled();

                        (reloadWords()).then(
                            function () {
                                $scope.createExercise.lock = false;
                            }
                        );
                    } else {
                        $scope.createExercise.lock = false;
                    }
                }
            );
        });

        $scope.closeModal = function () {
            $uibModalInstance.dismiss();
        };

        $scope.isExerciseCreating = function () {
            var customTranslationsNotEmpty = $scope.customWordEnabled && $scope.customTranslations.length;
            var selectedTranslationsNotEmpty = false;

            $scope.selectedWords.forEach(function (item, index, array) {
                if (item.selected) {
                    selectedTranslationsNotEmpty = array[index].selectedTranslations.reduce(function (result, current) {
                        return result || current;
                    }, false);
                }
            });

            return customTranslationsNotEmpty || selectedTranslationsNotEmpty;
        };

        word.post({body: $scope.wordQuery, via_dictionary: 1}).finally(
            function () {
                reloadWords();
            }
        );
    }
})();