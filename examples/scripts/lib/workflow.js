var wfjs;
(function (wfjs) {
    var ObjectHelper = (function () {
        function ObjectHelper() {
        }
        ObjectHelper.CopyProperties = function (source, destination) {
            if (source == null || destination == null) {
                return;
            }
            for (var key in source) {
                destination[key] = source[key];
            }
        };
        ObjectHelper.ShallowClone = function (obj) {
            if (obj == null) {
                return null;
            }
            var isArray = Object.prototype.toString.call(obj) == '[object Array]';
            if (isArray) {
                return this.ShallowCloneArray(obj);
            }
            else {
                return this.ShallowCloneObject(obj);
            }
        };
        ObjectHelper.ShallowCloneArray = function (obj) {
            var clone = [];
            for (var i = 0; i < obj.length; i++) {
                clone.push(obj[i]);
            }
            return clone;
        };
        ObjectHelper.ShallowCloneObject = function (obj) {
            var clone = {};
            for (var key in obj) {
                clone[key] = obj[key];
            }
            return clone;
        };
        return ObjectHelper;
    })();
    wfjs.ObjectHelper = ObjectHelper;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var EvalHelper = (function () {
        function EvalHelper() {
        }
        EvalHelper.Eval = function (thisArg, code) {
            var contextEval = function () {
                return eval(code);
            };
            return contextEval.call(thisArg);
        };
        return EvalHelper;
    })();
    wfjs.EvalHelper = EvalHelper;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var ActivityContext = (function () {
        function ActivityContext(options) {
            this.Extensions = options.Extensions || {};
            this.Inputs = options.Inputs || {};
            this.Outputs = options.Outputs || {};
        }
        return ActivityContext;
    })();
    wfjs.ActivityContext = ActivityContext;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Resources = {
        Error_Argument_Null: '{0}: argument cannot be null.',
        Error_Activity_Argument_Null: 'Activity expects {0} value: {1}.',
        Error_Activity_Invalid: 'Activity is not valid.'
    };
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var SerialActivity = (function () {
        function SerialActivity(activities) {
            this.$inputs = null;
            this.$outputs = null;
            this._activities = activities || [];
        }
        SerialActivity.prototype.Execute = function (context, done) {
            var internalContext = new wfjs.ActivityContext({
                Extensions: context.Extensions,
                Inputs: context.Inputs,
                Outputs: context.Outputs
            });
            this.InternalExecute(0, internalContext, function (err) {
                if (context.Outputs != internalContext.Outputs) {
                    context.Outputs = internalContext.Outputs;
                }
                done(err);
            });
        };
        SerialActivity.prototype.InternalExecute = function (index, context, done) {
            var _this = this;
            var activity = this._activities[index];
            if (activity == null) {
                return done(null);
            }
            activity.Execute(context, function (err) {
                if (err != null) {
                    return done(err);
                }
                _this.CopyOutputsToInputs(context);
                _this.InternalExecute(++index, context, done);
            });
        };
        SerialActivity.prototype.CopyOutputsToInputs = function (context) {
            for (var key in (context.Outputs || {})) {
                context.Inputs[key] = context.Outputs[key];
            }
        };
        return SerialActivity;
    })();
    wfjs.SerialActivity = SerialActivity;
})(wfjs || (wfjs = {}));
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
var wfjs;
(function (wfjs) {
    var WorkflowInvoker = (function () {
        function WorkflowInvoker(activity) {
            this._inputs = null;
            this._extensions = null;
            if (activity == null) {
                throw new Error(wfjs.Resources.Error_Argument_Null.replace(/\{0}/g, 'activity'));
            }
            if (typeof activity.Execute == 'function') {
                this._activity = activity;
            }
            else {
                this._activity = new wfjs.Workflow(activity);
            }
        }
        WorkflowInvoker.CreateActivity = function (activity) {
            return new WorkflowInvoker(activity);
        };
        WorkflowInvoker.prototype.Inputs = function (inputs) {
            this._inputs = inputs;
            return this;
        };
        WorkflowInvoker.prototype.Extensions = function (extensions) {
            this._extensions = extensions;
            return this;
        };
        WorkflowInvoker.prototype.Invoke = function (callback) {
            callback = callback || function () {
            };
            WorkflowInvoker.InvokeActivity(this._activity, this._inputs, this._extensions, callback);
        };
        WorkflowInvoker.InvokeActivity = function (activity, inputs, extensions, callback) {
            WorkflowInvoker.CreateContext(activity, inputs, extensions, function (err, context) {
                if (err != null) {
                    return callback(err, context);
                }
                try {
                    activity.Execute(context, function (err) {
                        if (err != null) {
                            return callback(err, null);
                        }
                        WorkflowInvoker.GetValueDictionary(activity.$outputs, context.Outputs, 'output', function (err, values) {
                            context.Outputs = values;
                            callback(err, context);
                        });
                    });
                }
                catch (err) {
                    callback(err);
                }
            });
        };
        WorkflowInvoker.CreateContext = function (activity, inputs, extensions, callback) {
            this.GetValueDictionary(activity.$inputs, inputs, 'input', function (err, values) {
                var context = err != null ? null : new wfjs.ActivityContext({
                    Extensions: extensions,
                    Inputs: values,
                    Outputs: {}
                });
                return callback(err, context);
            });
        };
        WorkflowInvoker.GetValueDictionary = function (keys, values, valueType, callback) {
            var result = {};
            for (var i = 0; i < (keys || []).length; i++) {
                var key = keys[i];
                if (values == null || values[key] === undefined) {
                    var message = wfjs.Resources.Error_Activity_Argument_Null.replace(/\{0}/g, valueType).replace(/\{1}/g, key);
                    return callback(new Error(message));
                }
                else {
                    result[key] = values[key];
                }
            }
            callback(null, result);
        };
        return WorkflowInvoker;
    })();
    wfjs.WorkflowInvoker = WorkflowInvoker;
})(wfjs || (wfjs = {}));
