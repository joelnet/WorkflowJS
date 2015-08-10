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
//# sourceMappingURL=Workflow.js.map