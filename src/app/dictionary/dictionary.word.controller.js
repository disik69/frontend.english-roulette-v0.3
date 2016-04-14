(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryWordController', DictionaryWordController);

    /** @ngInject */
    function DictionaryWordController($scope, $rootScope, Restangular, $log, preloader, lockedCallback, $uibModalInstance)
    {
        preloader.off();

        $scope.words = Restangular.all('word').getList({body: $scope.wordQuery}).$object;
    }
})();