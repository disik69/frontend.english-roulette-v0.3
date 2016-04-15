(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryWordController', DictionaryWordController);

    /** @ngInject */
    function DictionaryWordController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $uibModalInstance)
    {
        $scope.words = [];

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