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
            var next = function (err, innerContext) {
                if (err != null) {
                    return done(err);
                }
                var nextActivity = Workflow._GetNextActivity(activity, _this._activities);
                var activityExecute = nextActivity != null ? _this._ExecuteLoop.bind(_this) : function (innerContext, nextActivity, callback) {
                    callback();
                };
                activityExecute(innerContext, nextActivity, function (err) {
                    wfjs.ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    done(err);
                });
            };
            if (activity.activity != null) {
                this._ExecuteActivity(innerContext, activity, function (err) { return next(err, innerContext); });
            }
            else if (activity.value != null && activity.output != null) {
                this._ExecuteAssign(context, activity, function (err) { return next(err, context); });
            }
            else if (activity.condition != null) {
                this._ExecuteDecision(context, activity, function (err) { return next(err, context); });
            }
            else if (activity.switch != null) {
                this._ExecuteSwitch(context, activity, function (err) { return next(err, context); });
            }
            else if (activity.execute != null) {
                this._ExecuteCodeActivity(context, activity, function (err) { return next(err, context); });
            }
            else {
                done(new Error(wfjs.Resources.Error_Activity_Invalid));
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
         * _ExecuteDecision Evaluates the condition (to true or false) and executes next activity.
         */
        Workflow.prototype._ExecuteDecision = function (context, activity, done) {
            var err = null;
            try {
                var values = context.Inputs;
                wfjs.ObjectHelper.CopyProperties(context.Outputs, values);
                var condition = wfjs.EvalHelper.Eval(values, activity.condition);
                activity.next = condition ? activity.ontrue : activity.onfalse;
            }
            catch (ex) {
                err = ex;
            }
            finally {
                done(err);
            }
        };
        /**
         * _ExecuteDecision Evaluates the condition (to true or false) and executes next activity.
         */
        Workflow.prototype._ExecuteSwitch = function (context, activity, done) {
            var err = null;
            try {
                var values = context.Inputs;
                wfjs.ObjectHelper.CopyProperties(context.Outputs, values);
                var _switch = wfjs.EvalHelper.Eval(values, activity.switch);
                var _activity = activity.case[_switch] || activity.case['default'];
                if (_activity != null) {
                    this._ExecuteLoop(context, _activity, done);
                }
                else {
                    done();
                }
            }
            catch (ex) {
                err = ex;
            }
            finally {
                done(err);
            }
        };
        /**
         * _ExecuteAssign Assigns a value to an output variable.
         */
        Workflow.prototype._ExecuteAssign = function (context, activity, done) {
            var err = null;
            try {
                var assignActivity = activity;
                var values = context.Inputs;
                wfjs.ObjectHelper.CopyProperties(context.Outputs, values);
                context.Outputs[assignActivity.output] = wfjs.EvalHelper.Eval(values, assignActivity.value);
            }
            catch (ex) {
                err = ex;
            }
            finally {
                done(err);
            }
        };
        /**
         * _ExecuteCodeActivity Executes an IExecuteActivity block.
         */
        Workflow.prototype._ExecuteCodeActivity = function (context, activity, done) {
            var err = null;
            try {
                var innerContext = Workflow._CreateNextActivityContext(context);
                activity.execute(innerContext, function (err) {
                    if (innerContext != null) {
                        wfjs.ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    }
                    done(err);
                });
            }
            catch (ex) {
                err = ex;
            }
            finally {
                done(err);
            }
        };
        /**
         * _GetInputs Returns a collection of input values.
         */
        Workflow._GetInputs = function (context, inputs) {
            var value = {};
            var combinedValues = context.Inputs;
            wfjs.ObjectHelper.CopyProperties(context.Outputs, combinedValues);
            for (var key in inputs) {
                value[key] = wfjs.EvalHelper.Eval(combinedValues, inputs[key]);
            }
            return value;
        };
        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        Workflow._GetOutputs = function (context, outputs) {
            outputs = outputs || {};
            var value = {};
            for (var k in outputs) {
                var v = outputs[k];
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