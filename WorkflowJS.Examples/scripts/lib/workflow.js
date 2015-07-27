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
        ObjectHelper.GetKeys = function (obj) {
            var keys = [];
            for (var key in (obj || {})) {
                keys.push(key);
            }
            return keys;
        };
        ObjectHelper.GetValue = function (obj) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var value = null;
            var length = (params || []).length;
            if (length == 0) {
                return obj;
            }
            for (var i = 0; i < length; i++) {
                obj = obj[params[i]];
                if (obj == null) {
                    break;
                }
                else if (i == length - 1) {
                    value = obj;
                }
            }
            return value;
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
        ObjectHelper.CombineObjects = function (obj1, obj2) {
            var clone = {};
            ObjectHelper.CopyProperties(obj1, clone);
            ObjectHelper.CopyProperties(obj2, clone);
            return clone;
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
    var Specification = (function () {
        function Specification(criteria) {
            this._criteria = criteria;
        }
        Specification.prototype.IsSatisfiedBy = function (value) {
            return this._criteria(value);
        };
        return Specification;
    })();
    wfjs.Specification = Specification;
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
    (function (WorkflowState) {
        WorkflowState[WorkflowState["None"] = 0] = "None";
        WorkflowState[WorkflowState["Running"] = 1] = "Running";
        WorkflowState[WorkflowState["Complete"] = 2] = "Complete";
        WorkflowState[WorkflowState["Paused"] = 3] = "Paused";
        WorkflowState[WorkflowState["Fault"] = 4] = "Fault";
    })(wfjs.WorkflowState || (wfjs.WorkflowState = {}));
    var WorkflowState = wfjs.WorkflowState;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Activity = function (options) {
        return options;
    };
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Assign = function (options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new AssignActivity(options.values),
            next: options.next
        });
    };
    /**
     * AssignActivity Assigns values to Outputs.
     */
    var AssignActivity = (function () {
        function AssignActivity(values) {
            this.$inputs = ['*'];
            this.$outputs = ['*'];
            this._values = values || {};
        }
        AssignActivity.prototype.Execute = function (context, done) {
            for (var key in this._values) {
                context.Outputs[key] = wfjs.EvalHelper.Eval(context.Inputs, this._values[key]);
            }
            done();
        };
        return AssignActivity;
    })();
    wfjs.AssignActivity = AssignActivity;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Decision = function (options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '$next': '$next' },
            activity: new DecisionActivity(options),
            next: options.next
        });
    };
    /**
     * AssignActivity Assigns values to Outputs.
     */
    var DecisionActivity = (function () {
        function DecisionActivity(options) {
            this.$inputs = ['*'];
            this.$outputs = ['$next'];
            this._options = options || {};
        }
        DecisionActivity.prototype.Execute = function (context, done) {
            var result = wfjs.EvalHelper.Eval(context.Inputs, this._options.condition);
            context.Outputs['$next'] = result ? this._options.true : this._options.false;
            done();
        };
        return DecisionActivity;
    })();
    wfjs.DecisionActivity = DecisionActivity;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Execute = function (options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new ExecuteActivity(options),
            next: options.next
        });
    };
    /**
     * AssignActivity Assigns values to Outputs.
     */
    var ExecuteActivity = (function () {
        function ExecuteActivity(options) {
            this.$inputs = ['*'];
            this.$outputs = ['*'];
            this._options = options || {};
        }
        ExecuteActivity.prototype.Execute = function (context, done) {
            this._options.execute(context, done);
        };
        return ExecuteActivity;
    })();
    wfjs.ExecuteActivity = ExecuteActivity;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Flowchart = function (options) {
        return options;
    };
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    wfjs.Pause = function (options) {
        return new PauseActivity(options);
    };
    var PauseActivity = (function () {
        function PauseActivity(options) {
            this._type = 'pause';
            if (options != null) {
                this.next = options.next;
            }
        }
        PauseActivity.prototype.Pause = function (context) {
            return {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            };
        };
        PauseActivity.prototype.Resume = function (context, state) {
            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        };
        return PauseActivity;
    })();
    wfjs.PauseActivity = PauseActivity;
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
    var _Specifications = (function () {
        function _Specifications() {
        }
        _Specifications.IsPaused = new wfjs.Specification(function (o) { return o.StateData != null; });
        _Specifications.IsWildcardDictionary = new wfjs.Specification(function (o) { return o != null && o['*'] != null; });
        _Specifications.IsWildcardArray = new wfjs.Specification(function (o) { return o != null && o.length == 1 && o[0] == '*'; });
        return _Specifications;
    })();
    wfjs._Specifications = _Specifications;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var Workflow = (function () {
        function Workflow(map, state) {
            this.debug = true;
            this.State = 0 /* None */;
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
            this.State = 1 /* Running */;
            var activityCount = Object.keys(this._activities).length;
            if (activityCount == 0) {
                return done();
            }
            var activity = Workflow._GetFirstActivity(this._activities, this._stateData);
            this._ExecuteLoop(context, activity, function (err) {
                if (wfjs._Specifications.IsPaused.IsSatisfiedBy(context)) {
                    _this.State = 3 /* Paused */;
                }
                else if (err != null) {
                    _this.State = 4 /* Fault */;
                }
                else {
                    _this.State = 2 /* Complete */;
                }
                done(err);
            });
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
                var $next = wfjs.ObjectHelper.GetValue(innerContext, 'Outputs', '$next');
                var nextActivity = !wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext) ? _this._activities[$next] || Workflow._GetNextActivity(activity, _this._activities) : null;
                var activityExecute = nextActivity != null ? _this._ExecuteLoop.bind(_this) : function (innerContext, nextActivity, callback) {
                    callback();
                };
                activityExecute(innerContext, nextActivity, function (err) {
                    wfjs.ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    if (wfjs._Specifications.IsPaused.IsSatisfiedBy(innerContext)) {
                        context.StateData = innerContext.StateData;
                    }
                    done(err);
                });
            };
            // TODO: use InternalMapBase globally.
            var iActivity = activity;
            if (this.debug) {
                //console.log('context:', innerContext);
                console.log('Activity:', iActivity);
            }
            if (activity.activity != null) {
                this._ExecuteActivity(innerContext, activity, function (err) { return next(err, innerContext); });
            }
            else if (iActivity._type == 'pause') {
                context.StateData = activity.Pause(context);
                next(null, context);
            }
            else {
                done(new Error(wfjs.Resources.Error_Activity_Invalid));
            }
        };
        /**
         * _ExecuteActivity Executes the Activity.
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
         * _GetFirstActivity Gets the Activity to be executed first.
         */
        Workflow._GetFirstActivity = function (activities, state) {
            var hasStateNext = state != null && state.n != null;
            var activityName = hasStateNext ? state.n : Object.keys(activities)[0];
            return activities[activityName];
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
            this._stateData = null;
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
        WorkflowInvoker.prototype.State = function (state) {
            this._stateData = state;
            this._activity._stateData = state;
            return this;
        };
        WorkflowInvoker.prototype.Extensions = function (extensions) {
            this._extensions = extensions;
            return this;
        };
        WorkflowInvoker.prototype.Invoke = function (callback) {
            callback = callback || function () {
            };
            WorkflowInvoker._InvokeActivity(this._activity, this._inputs, this._stateData, this._extensions, callback);
        };
        WorkflowInvoker._InvokeActivity = function (activity, inputs, state, extensions, callback) {
            var _this = this;
            WorkflowInvoker._CreateContext(activity, inputs, state, extensions, function (err, context) {
                if (err != null) {
                    return callback(err, context);
                }
                try {
                    activity.Execute(context, function (err) {
                        if (err != null) {
                            return callback(err, null);
                        }
                        if (wfjs._Specifications.IsPaused.IsSatisfiedBy(context)) {
                            return callback(null, context);
                        }
                        _this._GetValueDictionary(activity.$outputs, context.Outputs, 'output', function (err, values) {
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
        WorkflowInvoker._CreateContext = function (activity, inputs, state, extensions, callback) {
            if (state != null) {
                return callback(null, this._CreateStateContext(activity, inputs, state, extensions));
            }
            this._GetValueDictionary(activity.$inputs, inputs, 'input', function (err, values) {
                var context = err != null ? null : new wfjs.ActivityContext({
                    Extensions: extensions,
                    Inputs: values,
                    Outputs: (state || {}).o || {}
                });
                return callback(err, context);
            });
        };
        WorkflowInvoker._CreateStateContext = function (activity, inputs, state, extensions) {
            var combinedInputs = {};
            wfjs.ObjectHelper.CopyProperties(state.i || {}, combinedInputs);
            wfjs.ObjectHelper.CopyProperties(inputs, combinedInputs);
            var outputs = {};
            wfjs.ObjectHelper.CopyProperties(state.o || {}, outputs);
            var context = new wfjs.ActivityContext({
                Extensions: extensions,
                Inputs: combinedInputs,
                Outputs: outputs
            });
            return context;
        };
        WorkflowInvoker._GetValueDictionary = function (keys, values, valueType, callback) {
            var result = {};
            var key;
            if (wfjs._Specifications.IsWildcardArray.IsSatisfiedBy(keys)) {
                for (key in values) {
                    result[key] = values[key];
                }
                return callback(null, result);
            }
            for (var i = 0; i < (keys || []).length; i++) {
                key = keys[i];
                if (values != null && values[key] !== undefined) {
                    result[key] = values[key];
                }
                else {
                    var message = wfjs.Resources.Error_Activity_Argument_Null.replace(/\{0}/g, valueType).replace(/\{1}/g, key);
                    return callback(new Error(message));
                }
            }
            callback(null, result);
        };
        return WorkflowInvoker;
    })();
    wfjs.WorkflowInvoker = WorkflowInvoker;
})(wfjs || (wfjs = {}));
