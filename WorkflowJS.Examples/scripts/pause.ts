/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />

declare var hljs;

module wfjsExample.Pause
{
    'use strict';

    class Application
    {
        private state: wfjs.IPauseState;

        private ngApp: ng.IModule;

        constructor()
        {
            this.ngApp = angular.module('mathproblem', [])
                .controller('MathProblemController', Controllers.MathProblemController);
        }
    }

    var app = new Application();
    hljs.initHighlightingOnLoad();
}