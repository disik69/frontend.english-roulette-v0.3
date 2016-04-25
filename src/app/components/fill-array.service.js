(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .factory('fillArray', fillArray);

    /** @ngInject */
    function fillArray()
    {
        return function (count, value) {
            return Array.apply(null, Array(count)).map(function () {return value})
        };
    }
})();