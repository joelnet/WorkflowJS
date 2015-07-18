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
//# sourceMappingURL=WorkflowInvoker.js.map