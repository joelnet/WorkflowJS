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
            if (obj == null || length == 0) {
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
        /**
         * TrimObject Returns the a shallow clone of the object (excluding any values that are null, undefined or have no keys).
         */
        ObjectHelper.TrimObject = function (obj) {
            var clone = ObjectHelper.ShallowClone(obj);
            for (var key in clone || {}) {
                var keys = ObjectHelper.GetKeys(clone[key]);
                if (clone[key] == null || keys.length == 0 || clone.length == 0) {
                    delete clone[key];
                }
            }
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
    (function (LogType) {
        LogType[LogType["None"] = 0] = "None";
        LogType[LogType["Debug"] = 1] = "Debug";
        LogType[LogType["Info"] = 2] = "Info";
        LogType[LogType["Warn"] = 3] = "Warn";
        LogType[LogType["Error"] = 4] = "Error";
    })(wfjs.LogType || (wfjs.LogType = {}));
    var LogType = wfjs.LogType;
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
    var _bll;
    (function (_bll) {
        var Logger = (function () {
            function Logger() {
            }
            /**
             * _log Sends message and optionalParams to the logger.
             */
            Logger.Log = function (logger, logType, message) {
                var optionalParams = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    optionalParams[_i - 3] = arguments[_i];
                }
                var log = Logger._getLogFunction(logger, logType);
                var args = [message].concat(optionalParams || []);
                if (log != null) {
                    log.apply(logger, args);
                }
            };
            /**
             * _getLogFunction returns the log function for the LogType. Falls back to 'log' if others aren't available.
             */
            Logger._getLogFunction = function (logger, logType) {
                var log = wfjs.ObjectHelper.GetValue(logger, 'log');
                switch (logType) {
                    case 1 /* Debug */: return wfjs.ObjectHelper.GetValue(logger, 'debug') || log;
                    case 2 /* Info */: return wfjs.ObjectHelper.GetValue(logger, 'info') || log;
                    case 3 /* Warn */: return wfjs.ObjectHelper.GetValue(logger, 'warn') || log;
                    case 4 /* Error */: return wfjs.ObjectHelper.GetValue(logger, 'error') || log;
                    default: return log;
                }
            };
            return Logger;
        })();
        _bll.Logger = Logger;
    })(_bll = wfjs._bll || (wfjs._bll = {}));
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var _bll;
    (function (_bll) {
        var Workflow = (function () {
            function Workflow() {
            }
            /**
              * GetStartActivityName Gets the name of the to be executed first.
              */
            Workflow.GetStartActivityName = function (activities, state) {
                var hasStateNext = state != null && state.n != null;
                var activityName = hasStateNext ? state.n : Object.keys(activities)[0];
                return activities[activityName] != null ? activityName : null;
            };
            /**
             * GetNextActivityName returns the name of the next Activity or null.
             */
            Workflow.GetNextActivityName = function (activity, context, activities) {
                if (activity == null) {
                    return null;
                }
                // the Activity sets $next
                var $next = wfjs.ObjectHelper.GetValue(context, 'Outputs', '$next');
                // 'next' value on the Activity.
                var nextActivityName = $next || wfjs.ObjectHelper.GetValue(activity, 'next');
                return activities[nextActivityName] != null ? nextActivityName : null;
            };
            /**
             * GetInputs Returns a collection of input values.
             */
            Workflow.GetInputs = function (context, inputs) {
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
             * GetOutputs Returns a collection out remapped outputs
             */
            Workflow.GetOutputs = function (context, outputs) {
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
             * CreateContext Creates a new Context for the Activity.
             */
            Workflow.CreateContext = function (activity, inputs, state, extensions, callback) {
                if (state != null) {
                    return callback(null, new wfjs.ActivityContext({
                        Extensions: extensions,
                        Inputs: wfjs.ObjectHelper.CombineObjects(state.i, inputs) || {},
                        Outputs: wfjs.ObjectHelper.ShallowClone(state.o) || {}
                    }));
                }
                Workflow.GetValueDictionary(activity.$inputs, inputs, 'input', function (err, values) {
                    var context = err != null ? null : new wfjs.ActivityContext({
                        Extensions: extensions,
                        Inputs: values,
                        Outputs: (state || {}).o || {}
                    });
                    return callback(err, context);
                });
            };
            /**
             * GetValueDictionary Returns a Dictionary<any> from 'values' that have matching 'keys'.
             */
            Workflow.GetValueDictionary = function (keys, values, valueType, callback) {
                var result = {};
                var key;
                if (wfjs._Specifications.IsWildcardArray.IsSatisfiedBy(keys)) {
                    return callback(null, wfjs.ObjectHelper.ShallowClone(values));
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
            /**
             * CreateChildActivityContext Returns a new context for inner activities.
             */
            Workflow.CreateChildActivityContext = function (context) {
                return context == null ? null : {
                    Extensions: wfjs.ObjectHelper.ShallowClone(context.Extensions),
                    Inputs: wfjs.ObjectHelper.CombineObjects(context.Inputs, context.Outputs),
                    Outputs: {}
                };
            };
            /**
             * CopyInnerContextToOuterContext Copies the outputs of innerContext to the outerContext.
             */
            Workflow.CopyInnerContextToOuterContext = function (innerContext, outerContext, activity) {
                if (innerContext == null || outerContext == null) {
                    return;
                }
                var outputs = _bll.Workflow.GetOutputs(innerContext, activity.$outputs);
                wfjs.ObjectHelper.CopyProperties(outputs, outerContext.Outputs);
                if (innerContext.State != null) {
                    outerContext.State = innerContext.State;
                }
            };
            /**
             * GetPauseState Returns an IPauseState from the ActivityContext and nextActivityName.
             */
            Workflow.GetPauseState = function (context, nextActivityName) {
                return {
                    i: wfjs.ObjectHelper.ShallowClone(wfjs.ObjectHelper.GetValue(context, 'Inputs')),
                    o: wfjs.ObjectHelper.ShallowClone(wfjs.ObjectHelper.GetValue(context, 'Outputs')),
                    n: nextActivityName
                };
            };
            return Workflow;
        })();
        _bll.Workflow = Workflow;
    })(_bll = wfjs._bll || (wfjs._bll = {}));
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
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new PauseActivity(options),
            next: options.next
        });
    };
    var PauseActivity = (function () {
        function PauseActivity(options) {
            this.$inputs = ['*'];
            this.$outputs = ['*'];
            if (options != null) {
                this.next = options.next;
            }
        }
        PauseActivity.prototype.Execute = function (context, done) {
            context.State = 3 /* Paused */;
            done();
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
        _Specifications.IsPaused = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 'State') == 3 /* Paused */ || wfjs.ObjectHelper.GetValue(o, 'StateData') != null; });
        _Specifications.IsWildcardDictionary = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, '*') != null; });
        _Specifications.IsWildcardArray = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 0) == '*'; });
        _Specifications.Has$next = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 'Outputs', '$next') != null; });
        _Specifications.IsWorkflowActivity = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 'activity') != null; });
        _Specifications.IsExecutableActivity = new wfjs.Specification(function (o) { return typeof wfjs.ObjectHelper.GetValue(o, 'Execute') == 'function'; });
        return _Specifications;
    })();
    wfjs._Specifications = _Specifications;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var Workflow = (function () {
        function Workflow(flowchart, state) {
            this.State = 0 /* None */;
            this.logger = console;
            flowchart = flowchart || {};
            flowchart.activities = flowchart.activities || {};
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
var wfjs;
(function (wfjs) {
    var WorkflowInvoker = (function () {
        function WorkflowInvoker(activity) {
            this._inputs = null;
            this._extensions = null;
            this._stateData = null;
            if (wfjs._Specifications.IsExecutableActivity.IsSatisfiedBy(activity)) {
                this._activity = activity;
            }
            else if (activity != null) {
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
            this._stateData = this._activity._stateData = state;
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
            if (activity == null) {
                return callback(null, { Inputs: {}, Outputs: {} });
            }
            wfjs._bll.Workflow.CreateContext(activity, inputs, state, extensions, function (err, context) {
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
                        wfjs._bll.Workflow.GetValueDictionary(activity.$outputs, context.Outputs, 'output', function (err, values) {
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
        return WorkflowInvoker;
    })();
    wfjs.WorkflowInvoker = WorkflowInvoker;
})(wfjs || (wfjs = {}));
