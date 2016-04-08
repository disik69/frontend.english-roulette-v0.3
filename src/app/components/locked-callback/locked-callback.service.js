(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .factory('lockedCallback', lockedCallback);

    /** @ngInject */
    function lockedCallback($exceptionHandler)
    {
        function LockedCallback(callback)
        {
            var callback = callback;

            this.lock = false;

            this.execute = function () {
                if (! this.lock) {
                    callback();
                }
            };
        }

        return function (callback) {
            if (! callback || ! angular.isFunction(callback)) {
                $exceptionHandler('It expects a callback in the first parameter.');
            }

            return new LockedCallback(callback);
        };
    }
})();