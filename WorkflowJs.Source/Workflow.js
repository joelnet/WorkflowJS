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
//# sourceMappingURL=Workflow.js.map