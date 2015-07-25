/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
var wfjsExample;
(function (wfjsExample) {
    var Pause;
    (function (Pause) {
        'use strict';
        var Application = (function () {
            function Application() {
                this.ngApp = angular.module('mathproblem', []).controller('MathProblemController', wfjsExample.Controllers.MathProblemController);
            }
            return Application;
        })();
        var app = new Application();
        hljs.initHighlightingOnLoad();
    })(Pause = wfjsExample.Pause || (wfjsExample.Pause = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=pause.js.map