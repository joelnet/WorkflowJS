/// <reference path="../typings/workflowjs/workflow.d.ts" />

module wfjsExample.Controllers
{
    'use strict';

    export interface IMathProblemScope extends ng.IScope
    {
        ctrl: MathProblemController;
        model:
        {
            problem: string;
            solution: number;
            answer: number;
            correct: boolean;
            workflowState: any;
            error: string;
        }
    }

    export class MathProblemController
    {
        public static $inject = ['$scope'];

        constructor(private $scope: IMathProblemScope)
        {
            angular.extend(
                $scope,
                {
                    ctrl: this,
                    model: {}
                },
                false);
        }

        public StartWorkflow(): void
        {
            var activity = wfjsExample.Activities.GetMathProblemWorkflow();
            activity.logger = console;

            this._InvokeWorkflow(activity, null, null);
        }

        public SubmitAnswer(answer: number): void
        {
            var activity = wfjsExample.Activities.GetMathProblemWorkflow();

            var inputs: wfjs.Dictionary<any> = {
                'answer': answer
            };

            this._InvokeWorkflow(activity, inputs, this.$scope.model.workflowState);
        }

        public Reset(): void
        {
            this.$scope.model = <any>{};
        }

        private _InvokeWorkflow(activity: wfjs.IActivity, inputs: wfjs.Dictionary<any>, state: wfjs.IPauseState): void
        {
            wfjs.WorkflowInvoker
                .CreateActivity(activity)
                .Inputs(inputs)
                .State(state)
                .Invoke((err, ctx) =>
                {
                    console.log('ctx', ctx);

                    if (err != null)
                    {
                        this.$scope.model.error = err.toString();
                    }

                    if (ctx.Outputs != null && ctx.Outputs['problem'] != null)
                    {
                        this.$scope.model.problem = ctx.Outputs['problem'];
                    }

                    if (ctx.Outputs != null && ctx.Outputs['correct'] != null)
                    {
                        this.$scope.model.correct = ctx.Outputs['correct'];
                    }

                    if (ctx.State == wfjs.WorkflowState.Paused)
                    {
                        this.$scope.model.workflowState = ctx.StateData;
                    }

                    this.$scope.$apply();
                });
        }
    }
}