var wfjs;
(function (wfjs) {
    var Workflow = (function () {
        function Workflow(map, state) {
            this.State = 0 /* None */;
            this.logger = console;
            if (map == null) {
                throw new Error(wfjs.Resources.Error_Argument_Null.replace(/\{0}/g, 'map'));
            }
            if (map.activities == null) {
                throw new Error(wfjs.Resources.Error_Argument_Null.replace(/\{0}/g, 'map.activities'));
            }
            this.$inputs = map.$inputs || [];
            this.$outputs = map.$outputs || [];
            this._activities = map.activities || {};
            this._extensions = map.$extensions || {};
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
                this.State = context.State = 2 /* Complete */;
                return done();
            }
            if (this._stateData != null) {
                this._log(0 /* None */, 'Workflow Resumed');
            }
            this._ExecuteLoop(firstActivityName, context, activity, function (err) {
                if (wfjs._Specifications.IsPaused.IsSatisfiedBy(context)) {
                    _this._log(0 /* None */, 'Workflow Paused');
                    _this.State = context.State = 3 /* Paused */;
                }
                else if (err != null) {
                    _this.State = context.State = 4 /* Fault */;
                }
                else {
                    _this.State = context.State = 2 /* Complete */;
                }
                done(err);
            });
        };
        /**
         * _ExecuteLoop Execution loop that executes every Activity.
         */
        Workflow.prototype._ExecuteLoop = function (activityName, context, activity, done) {
            var _this = this;
            var innerContext = Workflow._CreateNextActivityContext(context);
            var next = function (err, innerContext) {
                if (err != null) {
                    return done(err);
                }
                var $next = wfjs.ObjectHelper.GetValue(innerContext, 'Outputs', '$next');
                var nextActivityName = $next || wfjs._bll.Workflow.GetNextActivityName(activity, _this._activities);
                var nextActivity = !wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext) ? _this._activities[nextActivityName] : null;
                var dummyCallback = function (n, i, a, callback) {
                    callback();
                };
                var activityExecute = nextActivity != null ? _this._ExecuteLoop.bind(_this) : dummyCallback;
                activityExecute(nextActivityName, innerContext, nextActivity, function (err) {
                    wfjs.ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    if (wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext)) {
                        context.StateData = innerContext.StateData;
                    }
                    done(err);
                });
            };
            if (activity.activity != null) {
                this._ExecuteActivity(activityName, innerContext, activity, function (err) { return next(err, innerContext); });
            }
            else {
                this._log(4 /* Error */, activityName + ': ' + wfjs.Resources.Error_Activity_Invalid);
                done(new Error(wfjs.Resources.Error_Activity_Invalid));
            }
        };
        /**
         * _ExecuteActivity Executes the Activity.
         */
        Workflow.prototype._ExecuteActivity = function (activityName, context, activity, done) {
            var _this = this;
            var inputs = Workflow._GetInputs(context, activity.$inputs);
            wfjs.WorkflowInvoker.CreateActivity(activity.activity).Extensions(context.Extensions).Inputs(inputs).Invoke(function (err, innerContext) {
                if (innerContext != null) {
                    var outputs = Workflow._GetOutputs(innerContext, activity.$outputs);
                    wfjs.ObjectHelper.CopyProperties(outputs, context.Outputs);
                    if (wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext)) {
                        context.StateData = innerContext.StateData;
                    }
                }
                _this._log(0 /* None */, activityName, wfjs.ObjectHelper.TrimObject({
                    inputs: inputs,
                    outputs: wfjs.ObjectHelper.ShallowClone(wfjs.ObjectHelper.GetValue(innerContext, 'Outputs')),
                    err: err
                }));
                done(err);
            });
        };
        Workflow.prototype._log = function (logType, message) {
            var optionalParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                optionalParams[_i - 2] = arguments[_i];
            }
            var args = [this.logger, logType, 'wfjs.Workflow:'].concat([message]).concat(optionalParams || []);
            wfjs._bll.Logger.Log.apply(wfjs._bll.Logger, args);
        };
        /**
         * _GetInputs Returns a collection of input values.
         */
        Workflow._GetInputs = function (context, inputs) {
            var value = {};
            var allValues = wfjs.ObjectHelper.CombineObjects(context.Inputs, context.Outputs);
            if (wfjs._Specifications.IsWildcardDictionary.IsSatisfiedBy(inputs)) {
                return allValues;
            }
            for (var key in inputs) {
                value[key] = wfjs.EvalHelper.Eval(allValues, inputs[key]);
            }
            return value;
        };
        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        Workflow._GetOutputs = function (context, outputs) {
            outputs = outputs || {};
            var value = {};
            if (wfjs._Specifications.IsWildcardDictionary.IsSatisfiedBy(outputs)) {
                return wfjs.ObjectHelper.ShallowClone(context.Outputs);
            }
            for (var key in outputs) {
                var v = outputs[key];
                value[v] = context.Outputs[key];
            }
            return value;
        };
        /**
         * _CreateNextActivityContext Returns a new context for inner activities.
         */
        Workflow._CreateNextActivityContext = function (context) {
            if (context == null) {
                return null;
            }
            var nextContext = {
                Extensions: wfjs.ObjectHelper.ShallowClone(context.Extensions),
                Inputs: context.Inputs,
                Outputs: {}
            };
            wfjs.ObjectHelper.CopyProperties(context.Outputs, nextContext.Inputs);
            return nextContext;
        };
        return Workflow;
    })();
    wfjs.Workflow = Workflow;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Workflow.js.map