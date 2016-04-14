(function () {
    'use strict';

    angular.module('frontendEnglishRouletteV03')
        .service('preloader', Preloader);

    /** @ngInject */
    function Preloader($log)
    {
        var callCounter = 0;
        var basePreloader = angular.element('.base-preloader');
        var currentPreloader = null;
        var currentCondition = true;

        this.show = function () {
            callCounter++;

            if (currentCondition) {
                if (currentPreloader) {
                    currentPreloader.show();
                } else {
                    basePreloader.show();
                }
            }
        };

        this.hide = function () {
            callCounter--;

            if (! callCounter) {
                if (currentPreloader) {
                    currentPreloader.hide();
                    currentPreloader = null;
                } else {
                    basePreloader.hide();
                }

                currentCondition = true;
            }
        };

        this.set = function (preloadedElement) {
            if (callCounter) {
                if (currentPreloader) {
                    currentPreloader.hide();
                } else {
                    basePreloader.hide();
                }

                currentPreloader = preloadedElement.show();
            } else {
                currentPreloader = preloadedElement;
            }
        };

        this.off = function () {
            if (callCounter)
                if (currentPreloader) {
                    currentPreloader.hide()
                } else {
                    basePreloader.hide();
                }
            else {
                currentCondition = false;
            }
        };
    }
})();
