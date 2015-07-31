/// <reference path="../typings/workflowjs/workflow.d.ts" />
var wfjsExample;
(function (wfjsExample) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var MathProblemController = (function () {
            function MathProblemController($scope) {
                this.$scope = $scope;
                angular.extend($scope, {
                    ctrl: this,
                    model: {}
                }, false);
            }
            MathProblemController.prototype.StartWorkflow = function () {
                var activity = wfjsExample.Activities.GetMathProblemWorkflow();
                activity.logger = console;
                this._InvokeWorkflow(activity, null, null);
            };
            MathProblemController.prototype.SubmitAnswer = function (answer) {
                var activity = wfjsExample.Activities.GetMathProblemWorkflow();
                var inputs = {
                    'answer': answer
                };
                this._InvokeWorkflow(activity, inputs, this.$scope.model.workflowState);
            };
            MathProblemController.prototype.Reset = function () {
                this.$scope.model = {};
            };
            MathProblemController.prototype._InvokeWorkflow = function (activity, inputs, state) {
                var _this = this;
                wfjs.WorkflowInvoker.CreateActivity(activity).Inputs(inputs).State(state).Invoke(function (err, ctx) {
                    if (err != null) {
                        _this.$scope.model.error = err.toString();
                    }
                    if (ctx.Outputs != null && ctx.Outputs['problem'] != null) {
                        _this.$scope.model.problem = ctx.Outputs['problem'];
                    }
                    if (ctx.Outputs != null && ctx.Outputs['correct'] != null) {
                        _this.$scope.model.correct = ctx.Outputs['correct'];
                    }
                    if (ctx.State == 3 /* Paused */) {
                        _this.$scope.model.workflowState = ctx.StateData;
                    }
                });
            };
            MathProblemController.$inject = ['$scope'];
            return MathProblemController;
        })();
        Controllers.MathProblemController = MathProblemController;
    })(Controllers = wfjsExample.Controllers || (wfjsExample.Controllers = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=MathProblemController.js.map