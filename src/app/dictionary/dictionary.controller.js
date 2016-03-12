(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .controller('DictionaryController', DictionaryController);

    /** @ngInject */
    function DictionaryController ($scope, $localStorage, $log, greeting)
    {
        $log.debug(greeting);
    }
})();