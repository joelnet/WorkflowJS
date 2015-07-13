var wfjs;
(function (wfjs) {
    var WorkflowApplication = (function () {
        function WorkflowApplication(activity) {
            this.Extensions = {};
            this.Inputs = {};
            if (activity == null) {
                throw new Error('activity: argument cannot be null or empty.');
            }
            this.Activity = activity;
        }
        WorkflowApplication.prototype.Run = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            callback = typeof callback == 'function' ? callback : function () {
            };
            WorkflowApplication.CreateContext(this.Activity, this.Inputs, this.Extensions, function (err, context) {
                if (err != null) {
                    return callback(err, context);
                }
                _this.Activity.Execute(context, function (err) {
                    if (err != null) {
                        return callback(err, null);
                    }
                    WorkflowApplication.GetValueDictionary(_this.Activity.$outputs, context.Outputs, 'output', function (err, values) {
                        context.Outputs = values;
                        callback(err, context);
                    });
                });
            });
        };
        WorkflowApplication.CreateContext = function (activity, inputs, extensions, callback) {
            this.GetValueDictionary(activity.$inputs, inputs, 'input', function (err, values) {
                var context = err != null ? null : new wfjs.ActivityContext({
                    Extensions: extensions,
                    Inputs: values,
                    Outputs: {}
                });
                return callback(err, context);
            });
        };
        WorkflowApplication.GetValueDictionary = function (keys, values, valueType, callback) {
            var result = {};
            for (var i = 0; i < (keys || []).length; i++) {
                var key = keys[i];
                if (values == null || values[key] === undefined) {
                    return callback(new Error('Activity expects ' + valueType + ' value: ' + key), null);
                }
                else {
                    result[key] = values[key];
                }
            }
            callback(null, result);
        };
        return WorkflowApplication;
    })();
    wfjs.WorkflowApplication = WorkflowApplication;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=WorkflowApplication.js.map