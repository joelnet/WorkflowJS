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
                        WorkflowInvoker._GetValueDictionary(activity.$outputs, context.Outputs, 'output', function (err, values) {
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
            for (var i = 0; i < (keys || []).length; i++) {
                var key = keys[i];
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
//# sourceMappingURL=WorkflowInvoker.js.map