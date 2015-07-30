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
            WorkflowInvoker._InvokeActivity(this._activity, this._inputs, this._stateData, this._extensions, callback);
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
                    if (wfjs._Specifications.IsPaused.IsSatisfiedBy(context)) {
                        return callback(null, context);
                    }
                    wfjs._bll.Workflow.GetValueDictionary(activity.$outputs, context.Outputs, 'output', function (err, values) {
                        context.Outputs = values;
                        callback(err, context);
                    });
                });
            });
        };
        /**
         * _ActivityExecuteAsync Executes either Asynchronous or Synchronous Activity.
         */
        WorkflowInvoker._ActivityExecuteAsync = function (activity, context, done) {
            try {
                if (wfjs._Specifications.IsExecuteAsync.IsSatisfiedBy(activity.Execute)) {
                    activity.Execute(context, function (err) {
                        wfjs.ThreadHelper.NewThread(function () { return done(err); });
                    });
                }
                else {
                    activity.Execute(context);
                    wfjs.ThreadHelper.NewThread(function () { return done(); });
                }
            }
            catch (err) {
                done(err);
            }
        };
        return WorkflowInvoker;
    })();
    wfjs.WorkflowInvoker = WorkflowInvoker;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=WorkflowInvoker.js.map