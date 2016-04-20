(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .filter('strToDate', strToDate);

    /** @ngInject */
    function strToDate($filter)
    {
        return function (value, format, shield) {
            var milliseconds = Date.parse(value);
            var dateStr = shield || 'wrong format';

            if (milliseconds) {
                dateStr = $filter('date')(new Date(milliseconds), format);
            }

            return dateStr;
        }
    }
})();