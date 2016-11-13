(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .factory('wavesEffect', wavesEffect);

    /** @ngInject */
    function wavesEffect()
    {
        return Waves;
    }
})();