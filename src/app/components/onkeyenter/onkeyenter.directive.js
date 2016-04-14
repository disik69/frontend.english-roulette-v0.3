(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('onkeyenter', onkeyenter);

    /** @ngInject */
    function onkeyenter($log)
    {
        return {
            link: function (scope, element, attrs) {
                element.on('keypress', function (event) {
                    if (event.keyCode == 13) {
                        scope.$apply(attrs.onkeyenter);
                    }
                });
            }
        };
    }
})();