var wfjs;
(function (wfjs) {
    var _EvalHelper = (function () {
        function _EvalHelper() {
        }
        _EvalHelper.Eval = function (thisArg, code) {
            var contextEval = function () {
                return eval(code);
            };
            return contextEval.call(thisArg);
        };
        return _EvalHelper;
    })();
    wfjs._EvalHelper = _EvalHelper;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var _FunctionHelper = (function () {
        function _FunctionHelper() {
        }
        _FunctionHelper.ParameterCount = function (fn) {
            return _FunctionHelper.FormalParameterList(fn).length;
        };
        /**
         * FormalParameterList returns a string array of parameter names
         */
        _FunctionHelper.FormalParameterList = function (fn) {
            // code from: http://stackoverflow.com/questions/6921588/is-it-possible-to-reflect-the-arguments-of-a-javascript-function
            var fnText, argDecl;
            var args = [];
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            var r = argDecl[1].split(FN_ARG_SPLIT);
            for (var a in r) {
                var arg = r[a];
                arg.replace(FN_ARG, function (all, underscore, name) {
                    args.push(name);
                });
            }
            return args;
        };
        return _FunctionHelper;
    })();
    wfjs._FunctionHelper = _FunctionHelper;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var _ObjectHelper = (function () {
        function _ObjectHelper() {
        }
        /**
         * CopyProperties Copies properties source to the destination.
         */
        _ObjectHelper.CopyProperties = function (source, destination) {
            if (source == null || destination == null) {
                return;
            }
            for (var key in source) {
                destination[key] = source[key];
            }
        };
        /**
         * ToKeyValueArray Returns an array of KeyValuePair
         */
        _ObjectHelper.ToKeyValueArray = function (obj) {
            return _ObjectHelper.GetKeys(obj).map(function (key) { return new wfjs.KeyValuePair(key, obj[key]); });
        };
        /**
         * GetKeys Returns an array of keys on the object.
         */
        _ObjectHelper.GetKeys = function (obj) {
            var keys = [];
            obj = obj || {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        /**
         * GetValue recursive method to safely get the value of an object. to get the value of obj.point.x you would call
         *     it like this: GetValue(obj, 'point', 'x');
         *     If obj, point or x are null, null will be returned.
         */
        _ObjectHelper.GetValue = function (obj) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            return (params || []).reduce(function (prev, cur) { return prev == null ? prev : prev[cur]; }, obj);
        };
        /**
         * ShallowClone Returns a shallow clone of an Array or object.
         */
        _ObjectHelper.ShallowClone = function (obj) {
            if (obj == null) {
                return null;
            }
            return wfjs._Specifications.IsArray.IsSatisfiedBy(obj) ? this.ShallowCloneArray(obj) : this.ShallowCloneObject(obj);
        };
        /**
         * CombineObjects returns a new object with obj1 and obj2 combined.
         */
        _ObjectHelper.CombineObjects = function (obj1, obj2) {
            var clone = {};
            _ObjectHelper.CopyProperties(obj1, clone);
            _ObjectHelper.CopyProperties(obj2, clone);
            return clone;
        };
        /**
         * TrimObject Returns the a shallow clone of the object (excluding any values that are null, undefined or have no keys).
         */
        _ObjectHelper.TrimObject = function (obj) {
            return _ObjectHelper.ToKeyValueArray(obj).filter(function (kvp) { return kvp.value != null; }).reduce(function (prev, cur) {
                prev[cur.key] = cur.value, prev;
                return prev;
            }, {});
        };
        /**
         * ShallowCloneArray returns a shallow clone of an array.
         */
        _ObjectHelper.ShallowCloneArray = function (obj) {
            return (obj || []).map(function (o) { return o; });
        };
        /**
         * ShallowCloneObject returns a shallow clone of an object.
         */
        _ObjectHelper.ShallowCloneObject = function (obj) {
            var clone = {};
            for (var key in obj) {
                clone[key] = obj[key];
            }
            return clone;
        };
        return _ObjectHelper;
    })();
    wfjs._ObjectHelper = _ObjectHelper;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    var _Specification = (function () {
        function _Specification(criteria) {
            this._criteria = criteria;
        }
        _Specification.prototype.IsSatisfiedBy = function (value) {
            return this._criteria(value);
        };
        return _Specification;
    })();
    wfjs._Specification = _Specification;
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
    var KeyValuePair = (function () {
        function KeyValuePair(key, value) {
            this.key = key;
            this.value = value;
        }
        return KeyValuePair;
    })();
    wfjs.KeyValuePair = KeyValuePair;
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
                var log = wfjs._ObjectHelper.GetValue(logger, 'log');
                switch (logType) {
                    case 1 /* Debug */: return wfjs._ObjectHelper.GetValue(logger, 'debug') || log;
                    case 2 /* Info */: return wfjs._ObjectHelper.GetValue(logger, 'info') || log;
                    case 3 /* Warn */: return wfjs._ObjectHelper.GetValue(logger, 'warn') || log;
                    case 4 /* Error */: return wfjs._ObjectHelper.GetValue(logger, 'error') || log;
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
                var $next = wfjs._ObjectHelper.GetValue(context, 'Outputs', '$next');
                // 'next' value on the Activity.
                var nextActivityName = $next || wfjs._ObjectHelper.GetValue(activity, 'next');
                return activities[nextActivityName] != null ? nextActivityName : null;
            };
            /**
             * GetInputs Returns a collection of input values.
             */
            Workflow.GetInputs = function (context, inputs) {
                var value = {};
                var allValues = wfjs._ObjectHelper.CombineObjects(context.Inputs, context.Outputs);
                if (wfjs._Specifications.IsWildcardDictionary.IsSatisfiedBy(inputs)) {
                    return allValues;
                }
                for (var key in inputs) {
                    value[key] = wfjs._EvalHelper.Eval(allValues, inputs[key]);
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
                    return wfjs._ObjectHelper.ShallowClone(context.Outputs);
                }
                var keys = wfjs._ObjectHelper.GetKeys(outputs);
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
                        Inputs: wfjs._ObjectHelper.CombineObjects(state.i, inputs) || {},
                        Outputs: wfjs._ObjectHelper.ShallowClone(state.o) || {}
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
                var error = null;
                if (wfjs._Specifications.IsWildcardArray.IsSatisfiedBy(keys)) {
                    return callback(null, wfjs._ObjectHelper.ShallowClone(values));
                }
                (keys || []).forEach(function (key) {
                    if (values != null && values[key] !== undefined) {
                        result[key] = values[key];
                    }
                    else if (error == null) {
                        error = new Error(wfjs.Resources.Error_Activity_Argument_Null.replace(/\{0}/g, valueType).replace(/\{1}/g, key));
                    }
                });
                callback(error, result);
            };
            /**
             * CreateChildActivityContext Returns a new context for inner activities.
             */
            Workflow.CreateChildActivityContext = function (context) {
                return context == null ? null : {
                    Extensions: wfjs._ObjectHelper.ShallowClone(context.Extensions),
                    Inputs: wfjs._ObjectHelper.CombineObjects(context.Inputs, context.Outputs),
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
                wfjs._ObjectHelper.CopyProperties(outputs, outerContext.Outputs);
                if (innerContext.State != null) {
                    outerContext.State = innerContext.State;
                }
            };
            /**
             * GetPauseState Returns an IPauseState from the ActivityContext and nextActivityName.
             */
            Workflow.GetPauseState = function (context, nextActivityName) {
                return {
                    i: wfjs._ObjectHelper.ShallowClone(wfjs._ObjectHelper.GetValue(context, 'Inputs')),
                    o: wfjs._ObjectHelper.ShallowClone(wfjs._ObjectHelper.GetValue(context, 'Outputs')),
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
    function Activity(options) {
        return options;
    }
    wfjs.Activity = Activity;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    function Assign(options) {
        options = options || {};
        return wfjs.Execute({
            execute: function (context) {
                for (var key in (options.values || {})) {
                    context.Outputs[key] = wfjs._EvalHelper.Eval(context.Inputs, options.values[key]);
                }
            },
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
    }
    wfjs.Assign = Assign;
    ;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    function Decision(options) {
        options = options || {};
        return wfjs.Execute({
            execute: function (context) {
                var result = wfjs._EvalHelper.Eval(context.Inputs, options.condition);
                context.Outputs['$next'] = result ? options.true : options.false;
            },
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
    }
    wfjs.Decision = Decision;
    ;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    function Execute(options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new ExecuteActivity(options),
            next: options.next
        });
    }
    wfjs.Execute = Execute;
    ;
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
            if (wfjs._Specifications.IsExecuteAsync.IsSatisfiedBy(this._options.execute)) {
                this._options.execute(context, done);
            }
            else {
                this._options.execute(context);
                if (done != null) {
                    done();
                }
            }
        };
        return ExecuteActivity;
    })();
    wfjs.ExecuteActivity = ExecuteActivity;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    function Flowchart(options, state) {
        return new FlowchartActivity(options);
    }
    wfjs.Flowchart = Flowchart;
    ;
    var FlowchartActivity = (function () {
        function FlowchartActivity(flowchart, state) {
            this.State = 0 /* None */;
            this.logger = null;
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
        FlowchartActivity.prototype.Execute = function (context, done) {
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
        FlowchartActivity.prototype._ExecuteNextActivity = function (activityName, context, activity, done) {
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
                        wfjs._ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
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
        FlowchartActivity.prototype._ExecuteActivity = function (activityName, context, activity, done) {
            var _this = this;
            var inputs = wfjs._bll.Workflow.GetInputs(context, activity.$inputs);
            wfjs.WorkflowInvoker.CreateActivity(activity.activity).Extensions(context.Extensions).Inputs(inputs).Invoke(function (err, innerContext) {
                wfjs._bll.Workflow.CopyInnerContextToOuterContext(innerContext, context, activity);
                _this._log(0 /* None */, activityName, wfjs._ObjectHelper.TrimObject({
                    inputs: inputs,
                    outputs: wfjs._ObjectHelper.ShallowClone(wfjs._ObjectHelper.GetValue(innerContext, 'Outputs')),
                    err: err
                }));
                done(err);
            });
        };
        /**
         * Helper method for logging
         */
        FlowchartActivity.prototype._log = function (logType, message) {
            var optionalParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                optionalParams[_i - 2] = arguments[_i];
            }
            var args = [this.logger, logType, 'wfjs.Workflow:'].concat([message]).concat(optionalParams || []);
            wfjs._bll.Logger.Log.apply(wfjs._bll.Logger, args);
        };
        return FlowchartActivity;
    })();
    wfjs.FlowchartActivity = FlowchartActivity;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    function Pause(options) {
        options = options || {};
        return wfjs.Execute({
            execute: function (context) {
                context.State = 3 /* Paused */;
            },
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
    }
    wfjs.Pause = Pause;
    ;
})(wfjs || (wfjs = {}));
if (typeof module != 'undefined') {
    module.exports = wfjs;
}
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
    /**
     * _Specifications Specification Pattern test for commonly used conditions.
     */
    var _Specifications = (function () {
        function _Specifications() {
        }
        _Specifications.IsPaused = new wfjs._Specification(function (o) { return wfjs._ObjectHelper.GetValue(o, 'State') == 3 /* Paused */ || wfjs._ObjectHelper.GetValue(o, 'StateData') != null; });
        _Specifications.IsWildcardDictionary = new wfjs._Specification(function (o) { return wfjs._ObjectHelper.GetValue(o, '*') != null; });
        _Specifications.IsWildcardArray = new wfjs._Specification(function (o) { return wfjs._ObjectHelper.GetValue(o, 0) == '*'; });
        _Specifications.Has$next = new wfjs._Specification(function (o) { return wfjs._ObjectHelper.GetValue(o, 'Outputs', '$next') != null; });
        _Specifications.IsWorkflowActivity = new wfjs._Specification(function (o) { return wfjs._ObjectHelper.GetValue(o, 'activity') != null; });
        _Specifications.IsExecutableActivity = new wfjs._Specification(function (o) { return typeof wfjs._ObjectHelper.GetValue(o, 'Execute') == 'function'; });
        _Specifications.IsExecuteAsync = new wfjs._Specification(function (o) { return o != null && wfjs._FunctionHelper.ParameterCount(o) >= 2; });
        _Specifications.IsArray = new wfjs._Specification(function (o) { return Object.prototype.toString.call(o) == '[object Array]'; });
        return _Specifications;
    })();
    wfjs._Specifications = _Specifications;
})(wfjs || (wfjs = {}));
var wfjs;
(function (wfjs) {
    /**
     * WorkflowInvoker Activity or Workflow runner.
     */
    var WorkflowInvoker = (function () {
        /**
         * CreateActivity Returns a WorkflowInvoker with attached activity.
         */
        function WorkflowInvoker(activity) {
            this._inputs = null;
            this._extensions = null;
            this._stateData = null;
            if (wfjs._Specifications.IsExecutableActivity.IsSatisfiedBy(activity)) {
                this._activity = activity;
            }
            else if (activity != null) {
                this._activity = new wfjs.FlowchartActivity(activity);
            }
        }
        /**
         * CreateActivity Returns a WorkflowInvoker with attached activity.
         */
        WorkflowInvoker.CreateActivity = function (activity) {
            return new WorkflowInvoker(activity);
        };
        /**
         * Inputs Sets the inputs for the IActivity.
         */
        WorkflowInvoker.prototype.Inputs = function (inputs) {
            this._inputs = inputs;
            return this;
        };
        /**
         * State Sets the IPauseState for the IActivity.
         */
        WorkflowInvoker.prototype.State = function (state) {
            this._stateData = this._activity._stateData = state;
            return this;
        };
        /**
         * Extensions Sets the extensions for the IActivity.
         */
        WorkflowInvoker.prototype.Extensions = function (extensions) {
            this._extensions = extensions;
            return this;
        };
        /**
         * Invoke Executes the IActivity and returns an error or context.
         */
        WorkflowInvoker.prototype.Invoke = function (callback) {
            callback = callback || function () {
            };
            WorkflowInvoker._InvokeActivity(this._activity, this._inputs, this._stateData, this._extensions, function (err, context) {
                context = context || {};
                context.State = context.State || (err != null ? 4 /* Fault */ : 2 /* Complete */);
                setTimeout(function () { return callback(err, context); });
            });
        };
        /**
         * _InvokeActivity Creates an ActivityContext for the IActivity and calls the Execute method.
         */
        WorkflowInvoker._InvokeActivity = function (activity, inputs, state, extensions, callback) {
            if (activity == null) {
                return callback(null, { Inputs: {}, Outputs: {} });
            }
            wfjs._bll.Workflow.CreateContext(activity, inputs, state, extensions, function (err, context) {
                if (err != null) {
                    return callback(err, context);
                }
                WorkflowInvoker._ActivityExecuteAsync(activity, context, function (err) {
                    if (err != null) {
                        return callback(err, context);
                    }
                    wfjs._bll.Workflow.GetValueDictionary(activity.$outputs, context.Outputs, 'output', function (err, values) {
                        // ignore the errors from missing 'outputs'
                        if (wfjs._Specifications.IsPaused.IsSatisfiedBy(context)) {
                            err = null;
                        }
                        context.Outputs = values;
                        callback(err, context);
                    });
                });
            });
        };
        /**
         * _ActivityExecuteAsync Executes either Asynchronous or Synchronous Activity.
         */
        WorkflowInvoker._ActivityExecuteAsync = function (activity, context, callback) {
            if (wfjs._Specifications.IsExecuteAsync.IsSatisfiedBy(activity.Execute)) {
                try {
                    activity.Execute(context, callback);
                }
                catch (err) {
                    callback(err);
                }
            }
            else {
                try {
                    activity.Execute(context);
                }
                catch (err) {
                    return callback(err);
                }
                callback();
            }
        };
        return WorkflowInvoker;
    })();
    wfjs.WorkflowInvoker = WorkflowInvoker;
})(wfjs || (wfjs = {}));
