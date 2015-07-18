var wfjs;
(function (wfjs) {
    var Workflow = (function () {
        function Workflow(map) {
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
        }
        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        Workflow.prototype.Execute = function (context, done) {
            var activityCount = Object.keys(this._activities).length;
            if (activityCount == 0) {
                return done();
            }
            var activity = Workflow._GetFirstActivity(this._activities);
            this._ExecuteLoop(context, activity, done);
        };
        /**
         * _ExecuteLoop Execution loop that executes every Activity.
         */
        Workflow.prototype._ExecuteLoop = function (context, activity, done) {
            var _this = this;
            var innerContext = Workflow._CreateNextActivityContext(context);
            if (activity.activity != null) {
                this._ExecuteActivity(innerContext, activity, function (err) {
                    if (err != null) {
                        return done(err);
                    }
                    var nextActivity = Workflow._GetNextActivity(activity, _this._activities);
                    var fin = function (err) {
                        wfjs.ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                        done(err);
                    };
                    if (nextActivity != null) {
                        _this._ExecuteLoop(innerContext, nextActivity, fin);
                    }
                    else {
                        fin();
                    }
                });
            }
            else if (activity.value != null && activity.output != null) {
                var assignActivity = activity;
                var values = context.Inputs;
                wfjs.ObjectHelper.CopyProperties(context.Outputs, values);
                context.Outputs[assignActivity.output] = wfjs.EvalHelper.Eval(values, assignActivity.value);
                done();
            }
            else {
                done(new Error('Activity is not valid.'));
            }
        };
        /**
         * _ExecuteActivity Executes the actual Activity.
         */
        Workflow.prototype._ExecuteActivity = function (context, activity, done) {
            var inputs = Workflow._GetInputs(context, activity.$inputs);
            wfjs.WorkflowInvoker.CreateActivity(activity.activity).Extensions(context.Extensions).Inputs(inputs).Invoke(function (err, innerContext) {
                if (innerContext != null) {
                    var outputs = Workflow._GetOutputs(innerContext, activity.$outputs);
                    wfjs.ObjectHelper.CopyProperties(outputs, context.Outputs);
                }
                done(err);
            });
        };
        /**
         * _GetInputs Returns a collection of remapped inputs
         */
        Workflow._GetInputs = function (context, inputMap) {
            var value = {};
            for (var key in inputMap) {
                if (typeof inputMap[key].value != 'undefined') {
                    value[key] = inputMap[key].value;
                }
                else if (typeof inputMap[key].name != 'undefined') {
                    value[key] = context.Inputs[inputMap[key].name];
                }
            }
            return value;
        };
        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        Workflow._GetOutputs = function (context, outputMap) {
            outputMap = outputMap || {};
            var value = {};
            for (var k in context.Outputs) {
                if (typeof outputMap[k] == 'undefined') {
                    value[k] = context.Outputs[k];
                }
            }
            for (var k in outputMap) {
                var v = outputMap[k];
                value[v] = context.Outputs[k];
            }
            return value;
        };
        /**
         * _GetFirstActivity Gets the Activity to be executed first.
         */
        Workflow._GetFirstActivity = function (activities) {
            var key = Object.keys(activities)[0];
            return activities[key];
        };
        /**
         * _GetNextActivity returns the next Activity or null.
         */
        Workflow._GetNextActivity = function (activity, activities) {
            if (activity == null) {
                return null;
            }
            if (activity.next != null) {
                return activities[activity.next] || null;
            }
            return null;
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