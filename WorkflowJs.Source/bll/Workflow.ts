module wfjs._bll
{
    export class Workflow
    {
        /**
          * GetStartActivityName Gets the name of the to be executed first.
          */
        public static GetStartActivityName(activities: Dictionary<IActivityBase>, state: IPauseState): string
        {
            var hasStateNext = state != null && state.n != null;
            var activityName: string = hasStateNext ? state.n : Object.keys(activities)[0];

            return activities[activityName] != null ? activityName : null;
        }

        /**
         * GetNextActivityName returns the name of the next Activity or null.
         */
        public static GetNextActivityName(activity: IActivityBase, context: ActivityContext, activities: Dictionary<IActivityBase>): string
        {
            if (activity == null)
            {
                return null;
            }

            // the Activity sets $next
            var $next = _ObjectHelper.GetValue<string>(context, 'Outputs', '$next');

            // 'next' value on the Activity.
            var nextActivityName: string = $next || _ObjectHelper.GetValue<string>(activity, 'next');

            return activities[nextActivityName] != null ? nextActivityName : null;
        }

        /**
         * GetInputs Returns a collection of input values.
         */
        public static GetInputs(context: ActivityContext, inputs: Dictionary<any>): Dictionary<any>
        {
            var value: Dictionary<any> = {};

            var allValues: Dictionary<any> = _ObjectHelper.CombineObjects(context.Inputs, context.Outputs);

            if (_Specifications.IsWildcardDictionary.IsSatisfiedBy(inputs))
            {
                return allValues;
            }

            for (var key in inputs)
            {
                value[key] = _EvalHelper.Eval(allValues, inputs[key]);
            }

            return value;
        }

        /**
         * GetOutputs Returns a collection out remapped outputs
         */
        public static GetOutputs(context: ActivityContext, outputs: Dictionary<string>): Dictionary<any>
        {
            outputs = outputs || {};

            var value: Dictionary<any> = {};

            if (_Specifications.IsWildcardDictionary.IsSatisfiedBy(outputs))
            {
                return _ObjectHelper.ShallowClone(context.Outputs);
            }

            for (var key in outputs)
            {
                var v = outputs[key];
                value[v] = context.Outputs[key];
            }

            return value;
        }

        /**
         * CreateContext Creates a new Context for the Activity.
         */
        public static CreateContext(activity: IActivity, inputs: Dictionary<any>, state: IPauseState, extensions: Dictionary<any>, callback: (err: Error, context: ActivityContext) => void): void
        {
            if (state != null)
            {
                return callback(null, new ActivityContext({
                    Extensions: extensions,
                    Inputs: _ObjectHelper.CombineObjects(state.i, inputs) || {},
                    Outputs: _ObjectHelper.ShallowClone(state.o) || {}
                }));
            }

            Workflow.GetValueDictionary(activity.$inputs, inputs, 'input', (err, values) =>
            {
                var context = err != null ? null
                    : new ActivityContext(<ActivityContextOptions>{
                        Extensions: extensions,
                        Inputs: values,
                        Outputs: (<IPauseState>(state || {})).o || {}
                      });

                return callback(err, context);
            });
        }

        /**
         * GetValueDictionary Returns a Dictionary<any> from 'values' that have matching 'keys'.
         */
        public static GetValueDictionary(keys: string[], values: Dictionary<any>, valueType: string, callback: (err: Error, values?: Dictionary<any>) => void): void
        {
            var result: Dictionary<any> = {};
            var key: string;
            var error: Error = null;

            if (_Specifications.IsWildcardArray.IsSatisfiedBy(keys))
            {
                return callback(null, _ObjectHelper.ShallowClone(values));
            }

            for (var i = 0; i < (keys || []).length; i++)
            {
                key = keys[i];

                if (values != null && values[key] !== undefined)
                {
                    result[key] = values[key];
                }
                else if (error == null)
                {
                    error = new Error(Resources.Error_Activity_Argument_Null
                        .replace(/\{0}/g, valueType)
                        .replace(/\{1}/g, key));
                }
            }

            callback(error, result);
        }

        /**
         * CreateChildActivityContext Returns a new context for inner activities.
         */
        public static CreateChildActivityContext(context: ActivityContext): ActivityContext
        {
            return context == null ? null :
                <ActivityContext>{
                    Extensions: _ObjectHelper.ShallowClone(context.Extensions),
                    Inputs: _ObjectHelper.CombineObjects(context.Inputs, context.Outputs),
                    Outputs: {}
                };
        }

        /**
         * CopyInnerContextToOuterContext Copies the outputs of innerContext to the outerContext.
         */
        public static CopyInnerContextToOuterContext(innerContext: ActivityContext, outerContext: ActivityContext, activity: IWorkflowActivity): void
        {
            if (innerContext == null || outerContext == null)
            {
                return;
            }

            var outputs = _bll.Workflow.GetOutputs(innerContext, activity.$outputs);
            _ObjectHelper.CopyProperties(outputs, outerContext.Outputs);
                        
            if (innerContext.State != null)
            {
                outerContext.State = innerContext.State;
            }
        }

        /**
         * GetPauseState Returns an IPauseState from the ActivityContext and nextActivityName.
         */
        public static GetPauseState(context: ActivityContext, nextActivityName: string): IPauseState
        {
            return <IPauseState>{
                i: _ObjectHelper.ShallowClone(_ObjectHelper.GetValue(context, 'Inputs')),
                o: _ObjectHelper.ShallowClone(_ObjectHelper.GetValue(context, 'Outputs')),
                n: nextActivityName
            };
        }
    }
}