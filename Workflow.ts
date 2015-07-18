module wfjs
{
    export class Workflow implements Activity
    {
        public $inputs: string[];
        public $outputs: string[];

        private _activities: Dictionary<ActivityMap>;
        private _extensions: Dictionary<any>;

        constructor(map: IWorkflowMap)
        {
            if (map == null)
            {
                throw new Error(Resources.Error_Argument_Null.replace(/\{0}/g, 'map'));
            }

            if (map.activities == null)
            {
                throw new Error(Resources.Error_Argument_Null.replace(/\{0}/g, 'map.activities'));
            }

            this.$inputs = map.$inputs || [];
            this.$outputs = map.$outputs || [];
            this._activities = map.activities || {};
            this._extensions = map.$extensions || {};
        }

        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            var activityCount = Object.keys(this._activities).length;

            if (activityCount == 0)
            {
                return done();
            }

            var activity = Workflow._GetFirstActivity(this._activities);

            this._ExecuteLoop(context, activity, done);
        }

        /**
         * _ExecuteLoop Execution loop that executes every Activity.
         */
        private _ExecuteLoop(context: ActivityContext, activity: ActivityMap, done: (err?: Error) => void): void
        {
            var innerContext = Workflow._CreateNextActivityContext(context);

            this._ExecuteActivity(innerContext, activity, err =>
            {
                var nextActivity = Workflow._GetNextActivity(activity, this._activities);

                var innerDone = (err) =>
                {
                    ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    done(err);
                };

                if (nextActivity != null)
                {
                    this._ExecuteLoop(innerContext, nextActivity, innerDone);
                }
                else
                {
                    innerDone(err);
                }
            });
        }

        /**
         * _ExecuteActivity Executes the actual Activity.
         */
        private _ExecuteActivity(context: ActivityContext, activity: ActivityMap, done: (err?: Error) => void)
        {
            var inputs = Workflow._GetInputs(context, activity.$inputs);

            WorkflowInvoker
                .CreateActivity(activity.activity)
                .Extensions(context.Extensions)
                .Inputs(inputs)
                .Invoke((err, innerContext) =>
                {
                    if (innerContext != null)
                    {
                        var outputs = Workflow._GetOutputs(innerContext, activity.$outputs);
                        ObjectHelper.CopyProperties(outputs, context.Outputs);
                    }

                    done(err);
                });
        }

        /**
         * _GetInputs Returns a collection of remapped inputs
         */
        private static _GetInputs(context: ActivityContext, inputMap: Dictionary<ActivityInputMap>): Dictionary<any>
        {
            var value: Dictionary<any> = {};

            for (var key in inputMap)
            {
                if (typeof inputMap[key].value != 'undefined')
                {
                    value[key] = inputMap[key].value;
                }
                else if (typeof inputMap[key].name != 'undefined')
                {
                    value[key] = context.Inputs[inputMap[key].name];
                }
            }

            return value;
        }

        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        private static _GetOutputs(context: ActivityContext, outputMap: Dictionary<string>): Dictionary<any>
        {
            outputMap = outputMap || {};

            var value: Dictionary<any> = {};

            // get values that are NOT in the mapping.
            for (var k in context.Outputs)
            {
                if (typeof outputMap[k] == 'undefined')
                {
                    value[k] = context.Outputs[k];
                }
            }

            // get values that have a mapping.
            for (var k in outputMap)
            {
                var v = outputMap[k];
                value[v] = context.Outputs[k];
            }

            return value;
        }

        /**
         * _GetFirstActivity Gets the Activity to be executed first.
         */
        private static _GetFirstActivity(activities: Dictionary<ActivityMap>): ActivityMap
        {
            var key: string = Object.keys(activities)[0];
            return activities[key];
        }

        /**
         * _GetNextActivity returns the next Activity or null.
         */
        private static _GetNextActivity(activity: ActivityMap, activities: Dictionary<ActivityMap>): ActivityMap
        {
            if (activity == null || activity.next == null)
            {
                return null;
            }

            return activities[activity.next] || null;
        }

        /**
         * _CreateNextActivityContext Returns a new context for inner activities.
         */
        private static _CreateNextActivityContext(context: ActivityContext): ActivityContext
        {
            if (context == null)
            {
                return null;
            }

            var nextContext = <ActivityContext>{
                Extensions: <Dictionary<any>>ObjectHelper.ShallowClone(context.Extensions),
                Inputs: context.Inputs,
                Outputs: {}
            };

            ObjectHelper.CopyProperties(context.Outputs, nextContext.Inputs);

            return nextContext;
        }
    }
} 