(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('mainMenuItem', mainMenuItemWavesEffectDirective);

    /** @ngInject */
    function mainMenuItemWavesEffectDirective(wavesEffect)
    {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                wavesEffect.attach(element);
            }
        }
    }
})();