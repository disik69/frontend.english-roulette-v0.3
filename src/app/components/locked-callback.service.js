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
            var instance = this;
            var callback = callback;

            instance.lock = false;

            instance.execute = function () {
                if (! instance.lock) {
                    callback.apply(this, arguments);
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