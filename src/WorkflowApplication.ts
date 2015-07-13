module wfjs
{
    export class WorkflowApplication
    {
        public Activity: Activity;
        public Extensions: Dictionary<any> = {};
        public Inputs: Dictionary<any> = {};

        constructor(activity: Activity)
        {
            if (activity == null)
            {
                throw new Error('activity: argument cannot be null or empty.');
            }

            this.Activity = activity;
        }

        public Run(callback: (err: Error, context: ActivityContext) => void = null): void
        {
            callback = typeof callback == 'function' ? callback : function(){};

            WorkflowApplication.CreateContext(this.Activity, this.Inputs, this.Extensions, (err, context) =>
            {
                if (err != null)
                {
                    return callback(err, context);
                }

                this.Activity.Execute(context, err =>
                {
                    if (err != null)
                    {
                        return callback(err, null);
                    }

                    WorkflowApplication.GetValueDictionary(this.Activity.$outputs, context.Outputs, 'output', (err, values) =>
                    {
                        context.Outputs = values;
                        callback(err, context);
                    });
                });
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

        private static GetValueDictionary(keys: string[], values: Dictionary<any>, valueType: string, callback: (err: Error, values: Dictionary<any>) => void): void
        {
            var result: Dictionary<any> = {};

            for (var i = 0; i < (keys || []).length; i++)
            {
                var key = keys[i];

                if (values == null || values[key] === undefined)
                {
                    return callback(new Error('Activity expects ' + valueType + ' value: ' + key), null);
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