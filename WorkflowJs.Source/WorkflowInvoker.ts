module wfjs
{
    export class WorkflowInvoker
    {
        private _activity: IActivity;
        private _inputs: Dictionary<string> = null
        private _extensions: Dictionary<string> = null
        private _stateData: IPauseState = null;

        constructor(activity: IActivity | IFlowchart)
        {
            if (_Specifications.IsExecutableActivity.IsSatisfiedBy(activity))
            {
                this._activity = <IActivity>activity;
            }
            else if (activity != null)
            {
                this._activity = new Workflow(<IFlowchart>activity);
            }
        }

        public static CreateActivity(activity: IActivity | IFlowchart): WorkflowInvoker
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
            this._stateData = (<IInternalWorkflow><any>this._activity)._stateData = state;
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
            if (activity == null)
            {
                return callback(Error(Resources.Error_Argument_Null.replace(/\{0}/g, 'activity')));
            }

            _bll.Workflow.CreateContext(activity, inputs, state, extensions, (err, context) =>
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

                        _bll.Workflow.GetValueDictionary(activity.$outputs, context.Outputs, 'output', (err, values) =>
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
    }
} 