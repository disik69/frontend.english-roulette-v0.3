(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryTranslationController', DictionaryTranslationController);

    /** @ngInject */
    function DictionaryTranslationController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $q, $uibModalInstance, $timeout)
    {
        $scope.toggleTranslation = lockedCallback(function (index) {
            $scope.toggleTranslation.lock = true;

            var translations = $scope.currentExercise.translations;
            var exercise = Restangular.one('exercise', $scope.currentExercise.id);


            if ($scope.translationOne() && translations[index].used) {
                $scope.toggleTranslation.lock = false;
            } else {
                preloader.set($scope.dictionaryTranslationPreloader);

                if (translations[index].used) {
                    exercise.one('translation', translations[index].id).remove().then(
                        function () {
                            translations[index].used = false;
                        }
                    ).finally(
                        function () {
                            $scope.toggleTranslation.lock = false;
                        }
                    );
                } else {
                    exercise.all('translation').post({translation_id: translations[index].id}).then(
                        function () {
                            translations[index].used = true;
                        }
                    ).finally(
                        function () {
                            $scope.toggleTranslation.lock = false;
                        }
                    );
                }
            }
        });

        $scope.translationOne = function () {
            var count = 0;

            $scope.currentExercise.translations.forEach(function (item) {
                if (item.used) {
                    count++;
                }
            });

            return count == 1;
        };

        $scope.closeModal = function () {
            $uibModalInstance.dismiss();
        };
    }
})();