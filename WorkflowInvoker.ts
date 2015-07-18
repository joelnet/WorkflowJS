module wfjs
{
    export class WorkflowInvoker
    {
        private _activity: Activity;
        private _inputs: Dictionary<string> = null
        private _extensions: Dictionary<string> = null

        constructor(activity: Activity | IFlowchartMap)
        {
            if (activity == null)
            {
                throw new Error(Resources.Error_Argument_Null.replace(/\{0}/g, 'activity'));
            }

            if (typeof (<any>activity).Execute == 'function')
            {
                this._activity = <Activity>activity;
            }
            else
            {
                this._activity = new Workflow(<IFlowchartMap>activity);
            }
        }

        public static CreateActivity(activity: Activity | IFlowchartMap): WorkflowInvoker
        {
            return new WorkflowInvoker(activity);
        }

        public Inputs(inputs: Dictionary<any>): WorkflowInvoker
        {
            this._inputs = inputs;
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

            WorkflowInvoker.InvokeActivity(this._activity, this._inputs, this._extensions, callback);
        }

        private static InvokeActivity(activity: Activity, inputs: Dictionary<string>, extensions: Dictionary<string>, callback: (err: Error, context?: ActivityContext) => void): void
        {
            WorkflowInvoker.CreateContext(activity, inputs, extensions, (err, context) =>
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

                        WorkflowInvoker.GetValueDictionary(activity.$outputs, context.Outputs, 'output', (err, values) =>
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

        private static CreateContext(activity: Activity, inputs: Dictionary<any>, extensions: Dictionary<any>, callback: (err: Error, context: ActivityContext) => void): void
        {
            this.GetValueDictionary(activity.$inputs, inputs, 'input', (err, values) =>
            {
                var context = err != null ? null
                    : new ActivityContext(<ActivityContextOptions>{
                        Extensions: extensions,
                        Inputs: values,
                        Outputs: {}
                      });

                return callback(err, context);
            });
        }

        private static GetValueDictionary(keys: string[], values: Dictionary<any>, valueType: string, callback: (err: Error, values?: Dictionary<any>) => void): void
        {
            var result: Dictionary<any> = {};

            for (var i = 0; i < (keys || []).length; i++)
            {
                var key = keys[i];

                if (values == null || values[key] === undefined)
                {
                    var message = Resources.Error_Activity_Argument_Null
                        .replace(/\{0}/g, valueType)
                        .replace(/\{1}/g, key);
                    return callback(new Error(message));
                }
                else
                {
                    result[key] = values[key];
                }
            }

            callback(null, result);
        }
    }
} 