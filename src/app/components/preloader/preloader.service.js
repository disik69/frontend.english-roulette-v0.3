(function () {
    'use strict';

    angular.module('frontendEnglishRouletteV03')
        .service('preloader', Preloader);

    /** @ngInject */
    function Preloader()
    {
        var basePreloader = angular.element('.base-preloader');
        var currentPreloader = null;
        var currentCondition = true;

        this.show = function () {
            if (currentCondition) {
                if (currentPreloader) {
                    currentPreloader.show();
                } else {
                    basePreloader.show();
                }
            }
        };

        this.hide = function () {
            if (currentCondition) {
                if (currentPreloader) {
                    currentPreloader.hide();
                    currentPreloader = null;
                } else {
                    basePreloader.hide();
                }
            } else {
                currentCondition = true;
                currentPreloader = null;
            }
        };

        this.set = function (preloadedElement) {
            currentPreloader = preloadedElement;
        };

        this.off = function () {
            currentCondition = false;
        };
    }
})();
