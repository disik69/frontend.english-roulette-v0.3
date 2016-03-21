(function () {
    'use strict';

    angular
        .module('frontendEnglishRouletteV03')
        .directive('dropdownMenuItem', dropdownMenuItem)
        .directive('simpleMenuItem', simpleMenuItem);

    /** @ngInject */
    function dropdownMenuItem($compile, $log)
    {
        return {
            scope: {
                collapseCycle: '=dropdownMenuItem'
            },
            link: function (scope, element, attrs) {
                var enabledCollapseCycle = true;

                scope.collapsed = true;

                scope.switchCollapse = function () {
                    enabledCollapseCycle = false;
                    scope.collapsed = ! scope.collapsed;
                    scope.collapseCycle = ! scope.collapseCycle;
                };

                scope.$watch('collapseCycle', function () {
                    if (enabledCollapseCycle) {
                        scope.collapsed = true;
                    } else {
                        enabledCollapseCycle = true;
                    }
                });

                scope.collapse = function () {
                    scope.collapsed = true;
                };

                scope.doExpanding = function () {
                    element.addClass('open');
                };

                scope.doCollapsed = function () {
                    element.removeClass('open');
                };

                element.find('.dropdown-toggle').attr('ng-click', 'switchCollapse()');

                var dropdownMenu = element.find('.dropdown-menu');

                dropdownMenu.attr('uib-collapse', 'collapsed');
                dropdownMenu.attr('expanding', 'doExpanding()');
                dropdownMenu.attr('collapsed', 'doCollapsed()');
                dropdownMenu.find('li > a').attr('ng-click', 'collapse()');

                var compileElement = $compile(element.children());

                compileElement(scope);
            }
        };
    }

    /** @ngInject */
    function simpleMenuItem($compile, $log)
    {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    scope.collapseCycle = ! scope.collapseCycle;
                });
            }
        };
    }
})();