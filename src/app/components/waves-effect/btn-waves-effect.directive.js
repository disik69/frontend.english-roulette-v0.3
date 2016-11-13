(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('btn', btnWavesEffectDirective);

    /** @ngInject */
    function btnWavesEffectDirective(wavesEffect)
    {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                wavesEffect.attach(element);
            }
        }
    }
})();