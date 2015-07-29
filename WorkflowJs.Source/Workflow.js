var wfjs;
(function (wfjs) {
    var Workflow = (function () {
        function Workflow(flowchart, state) {
            this.State = 0 /* None */;
            this.logger = console;
            if (flowchart == null) {
                throw new Error(wfjs.Resources.Error_Argument_Null.replace(/\{0}/g, 'flowchart'));
            }
            if (flowchart.activities == null) {
                throw new Error(wfjs.Resources.Error_Argument_Null.replace(/\{0}/g, 'flowchart.activities'));
            }
            this.$inputs = flowchart.$inputs || [];
            this.$outputs = flowchart.$outputs || [];
            this._activities = flowchart.activities || {};
            this._extensions = flowchart.$extensions || {};
            this._stateData = state || null;
        }
        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        Workflow.prototype.Execute = function (context, done) {
            var _this = this;
            this.State = context.State = 1 /* Running */;
            var firstActivityName = wfjs._bll.Workflow.GetStartActivityName(this._activities, this._stateData);
            var activity = this._activities[firstActivityName];
            if (activity == null) {
                this._log(0 /* None */, 'Workflow Complete');
                this.State = context.State = 2 /* Complete */;
                return done();
            }
            if (this._stateData != null) {
                this._log(0 /* None */, 'Workflow Resumed');
            }
            this._ExecuteNextActivity(firstActivityName, context, activity, function (err) {
                if (err != null) {
                    context.State = 4 /* Fault */;
                }
                else {
                    context.State = _this.State == 1 /* Running */ ? 2 /* Complete */ : _this.State;
                }
                switch (context.State) {
                    case 2 /* Complete */:
                        _this._log(0 /* None */, 'Workflow Complete');
                        break;
                    case 4 /* Fault */:
                        _this._log(0 /* None */, 'Workflow Faulted');
                        break;
                    case 3 /* Paused */:
                        _this._log(0 /* None */, 'Workflow Paused');
                        break;
                    case 1 /* Running */:
                        _this._log(0 /* None */, 'Workflow Running');
                        break;
                }
                done(err);
            });
        };
        /**
         * _ExecuteNextActivity Execution loop that executes every Activity.
         */
        Workflow.prototype._ExecuteNextActivity = function (activityName, context, activity, done) {
            var _this = this;
            if (activity == null) {
                return done();
            }
            var innerContext = wfjs._bll.Workflow.CreateChildActivityContext(context);
            if (wfjs._Specifications.IsWorkflowActivity.IsSatisfiedBy(activity)) {
                this._ExecuteActivity(activityName, innerContext, activity, function (err) {
                    if (err != null) {
                        _this.State = 4 /* Fault */;
                        return done(err);
                    }
                    var nextActivityName = wfjs._bll.Workflow.GetNextActivityName(activity, innerContext, _this._activities);
                    var nextActivity = _this._activities[nextActivityName] || null;
                    if (wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext)) {
                        context.StateData = wfjs._bll.Workflow.GetPauseState(context, nextActivityName);
                        _this.State = innerContext.State;
                        return done();
                    }
                    _this._ExecuteNextActivity(nextActivityName, innerContext, nextActivity, function (err) {
                        wfjs.ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                        if (wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext)) {
                            context.StateData = innerContext.StateData;
                        }
                        done(err);
                    });
                });
            }
            else {
                this._log(4 /* Error */, activityName + ': ' + wfjs.Resources.Error_Activity_Invalid);
                done(new Error(wfjs.Resources.Error_Activity_Invalid));
            }
        };
        /**
         * _ExecuteActivity Calls WorkflowInvoker to execute the Activity.
         */
        Workflow.prototype._ExecuteActivity = function (activityName, context, activity, done) {
            var _this = this;
            var inputs = wfjs._bll.Workflow.GetInputs(context, activity.$inputs);
            wfjs.WorkflowInvoker.CreateActivity(activity.activity).Extensions(context.Extensions).Inputs(inputs).Invoke(function (err, innerContext) {
                wfjs._bll.Workflow.CopyInnerContextToOuterContext(innerContext, context, activity);
                _this._log(0 /* None */, activityName, wfjs.ObjectHelper.TrimObject({
                    inputs: inputs,
                    outputs: wfjs.ObjectHelper.ShallowClone(wfjs.ObjectHelper.GetValue(innerContext, 'Outputs')),
                    err: err
                }));
                done(err);
            });
        };
        /**
         * Helper method for logging
         */
        Workflow.prototype._log = function (logType, message) {
            var optionalParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                optionalParams[_i - 2] = arguments[_i];
            }
            var args = [this.logger, logType, 'wfjs.Workflow:'].concat([message]).concat(optionalParams || []);
            wfjs._bll.Logger.Log.apply(wfjs._bll.Logger, args);
        };
        return Workflow;
    })();
    wfjs.Workflow = Workflow;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Workflow.js.map