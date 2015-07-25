module wfjs
{
    export class WorkflowInvoker
    {
        private _activity: IActivity;
        private _inputs: Dictionary<string> = null
        private _extensions: Dictionary<string> = null
        private _stateData: IPauseState = null;

        constructor(activity: IActivity | IFlowchartMap)
        {
            if (activity == null)
            {
                throw new Error(Resources.Error_Argument_Null.replace(/\{0}/g, 'activity'));
            }

            if (typeof (<any>activity).Execute == 'function')
            {
                this._activity = <IActivity>activity;
            }
            else
            {
                this._activity = new Workflow(<IFlowchartMap>activity);
            }
        }

        public static CreateActivity(activity: IActivity | IFlowchartMap): WorkflowInvoker
        {
            return new WorkflowInvoker(activity);
        }

        public Inputs(inputs: Dictionary<any>): WorkflowInvoker
        {
            this._inputs = inputs;
            return this;
        }

        public State(state: IPauseState): WorkflowInvoker
        {
            this._stateData = state;
            (<IInternalWorkflow><any>this._activity)._stateData = state;
            return this;
        }

        public Extensions(extensions: Dictionary<any>): WorkflowInvoker
        {
            this._extensions = extensions;
            return this;
        }

        public Invoke(callback?: (err: Error, context?: ActivityContext) => void): void
        {
            callback = callback || function(){};

            WorkflowInvoker._InvokeActivity(this._activity, this._inputs, this._stateData, this._extensions, callback);
        }

        private static _InvokeActivity(activity: IActivity, inputs: Dictionary<string>, state: IPauseState, extensions: Dictionary<string>, callback: (err: Error, context?: ActivityContext) => void): void
        {
            WorkflowInvoker._CreateContext(activity, inputs, state, extensions, (err, context) =>
            {
                if (err != null)
                {
                    return callback(err, context);
                }

                try
                {
                    activity.Execute(context, err =>
                    {
                        if (err != null)
                        {
                            return callback(err, null);
                        }

                        if (_Specifications.IsPaused.IsSatisfiedBy(context))
                        {
                            return callback(null, context);
                        }

                        WorkflowInvoker._GetValueDictionary(activity.$outputs, context.Outputs, 'output', (err, values) =>
                        {
                            context.Outputs = values;
                            callback(err, context);
                        });
                    });
                }
                catch (err)
                {
                    callback(err);
                }
            });
        }

        private static _CreateContext(activity: IActivity, inputs: Dictionary<any>, state: IPauseState, extensions: Dictionary<any>, callback: (err: Error, context: ActivityContext) => void): void
        {
            if (state != null)
            {
                return callback(null, this._CreateStateContext(activity, inputs, state, extensions));
            }

            this._GetValueDictionary(activity.$inputs, inputs, 'input', (err, values) =>
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

        private static _CreateStateContext(activity: IActivity, inputs: Dictionary<any>, state: IPauseState, extensions: Dictionary<any>): ActivityContext
        {
            var combinedInputs: Dictionary<any> = {};
            ObjectHelper.CopyProperties(state.i || {}, combinedInputs);
            ObjectHelper.CopyProperties(inputs, combinedInputs);

            var outputs: Dictionary<any> = {};
            ObjectHelper.CopyProperties(state.o || {}, outputs);

            var context = new ActivityContext({
                Extensions: extensions,
                Inputs: combinedInputs,
                Outputs: outputs
            });

            return context;
        }

        private static _GetValueDictionary(keys: string[], values: Dictionary<any>, valueType: string, callback: (err: Error, values?: Dictionary<any>) => void): void
        {
            var result: Dictionary<any> = {};

            for (var i = 0; i < (keys || []).length; i++)
            {
                var key = keys[i];

                if (values != null && values[key] !== undefined)
                {
                    result[key] = values[key];
                }
                else
                {
                    var message = Resources.Error_Activity_Argument_Null
                        .replace(/\{0}/g, valueType)
                        .replace(/\{1}/g, key);

                    return callback(new Error(message));
                }
            }

            callback(null, result);
        }
    }
} 