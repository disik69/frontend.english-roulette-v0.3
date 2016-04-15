(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryWordController', DictionaryWordController);

    /** @ngInject */
    function DictionaryWordController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $uibModalInstance)
    {
        $scope.words = [];
        $scope.customTranslations = [];
        $scope.selectedTranslations;

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

        $scope.createExercise = function () {


            //$uibModalInstance.close();
        };

        $scope.closeModal = function () {
            $uibModalInstance.dismiss();
        };

        Restangular.all('word').getList({body: $scope.wordQuery}).then(
            function (response) {
                $scope.words = response.data;
            }
        ).finally(
            function () {
                preloader.hideForcibly();
            }
        );
    }
})();