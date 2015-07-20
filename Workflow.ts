module wfjs
{
    export class Workflow implements Activity
    {
        public $inputs: string[];
        public $outputs: string[];

        private _activities: Dictionary<IMapBase>;
        private _extensions: Dictionary<any>;

        constructor(map: IFlowchartMap)
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
        private _ExecuteLoop(context: ActivityContext, activity: IMapBase, done: (err?: Error) => void): void
        {
            var innerContext = Workflow._CreateNextActivityContext(context);

            var next = (err, innerContext: ActivityContext) =>
            {
                if (err != null)
                {
                    return done(err);
                }

                var nextActivity = Workflow._GetNextActivity(activity, this._activities);

                var activityExecute = nextActivity != null
                    ? this._ExecuteLoop.bind(this)
                    : (innerContext, nextActivity, callback) => { callback(); };

                activityExecute(innerContext, nextActivity, err =>
                {
                    ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    done(err);
                });
            }

            if ((<ActivityMap>activity).activity != null)
            {
                this._ExecuteActivity(innerContext, <ActivityMap>activity, err => next(err, innerContext));
            }
            else if ((<IAssignActivity>activity).value != null && (<IAssignActivity>activity).output != null)
            {
                this._ExecuteAssign(context, <IAssignActivity>activity, err => next(err, context));
            }
            else if ((<IDecisionActivity>activity).condition != null)
            {
                this._ExecuteDecision(context, <IDecisionActivity>activity, err => next(err, context));
            }
            else if ((<ISwitchActivity>activity).switch != null)
            {
                this._ExecuteSwitch(context, <ISwitchActivity>activity, err => next(err, context));
            }
            else if ((<IExecuteActivity>activity).execute != null)
            {
                this._ExecuteCodeActivity(context, <IExecuteActivity>activity, err => next(err, context));
            }
            else
            {
                done(new Error(Resources.Error_Activity_Invalid));
            }
        }

        /**
         * _ExecuteActivity Executes the actual Activity.
         */
        private _ExecuteActivity(context: ActivityContext, activity: ActivityMap, done: (err?: Error) => void): void
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
         * _ExecuteDecision Evaluates the condition (to true or false) and executes next activity.
         */
        private _ExecuteDecision(context: ActivityContext, activity: IDecisionActivity, done: (err?: Error) => void): void
        {
            var err: Error = null;

            try
            {
                var values: Dictionary<any> = context.Inputs;
                ObjectHelper.CopyProperties(context.Outputs, values);

                var condition: boolean = EvalHelper.Eval(values, activity.condition);

                activity.next = condition ? activity.ontrue : activity.onfalse;
            }
            catch (ex)
            {
                err = ex;
            }
            finally
            {
                done(err);
            }
        }

        /**
         * _ExecuteDecision Evaluates the condition (to true or false) and executes next activity.
         */
        private _ExecuteSwitch(context: ActivityContext, activity: ISwitchActivity, done: (err?: Error) => void): void
        {
            var err: Error = null;

            try
            {
                var values: Dictionary<any> = context.Inputs;
                ObjectHelper.CopyProperties(context.Outputs, values);

                var _switch = EvalHelper.Eval(values, activity.switch);
                var _activity = activity.case[_switch] || activity.case['default'];

                if (_activity != null)
                {
                    this._ExecuteLoop(context, _activity, done);
                }
                else
                {
                    done();
                }
            }
            catch (ex)
            {
                err = ex;
            }
            finally
            {
                done(err);
            }
        }

        /**
         * _ExecuteAssign Assigns a value to an output variable.
         */
        private _ExecuteAssign(context: ActivityContext, activity: IAssignActivity, done: (err?: Error) => void): void
        {
            var err: Error = null;

            try
            {
                var assignActivity = <IAssignActivity>activity;

                var values: Dictionary<any> = context.Inputs;
                ObjectHelper.CopyProperties(context.Outputs, values);

                context.Outputs[assignActivity.output] = EvalHelper.Eval(values, assignActivity.value);
            }
            catch (ex)
            {
                err = ex;
            }
            finally
            {
                done(err);
            }
        }

        /**
         * _ExecuteCodeActivity Executes an IExecuteActivity block.
         */
        private _ExecuteCodeActivity(context: ActivityContext, activity: IExecuteActivity, done: (err?: Error) => void): void
        {
            var err: Error = null;

            try
            {
                var innerContext = Workflow._CreateNextActivityContext(context);

                activity.execute(innerContext, err =>
                {
                    if (innerContext != null)
                    {
                        ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    }

                    done(err);
                });
            }
            catch (ex)
            {
                err = ex;
            }
            finally
            {
                done(err);
            }
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
        private static _GetFirstActivity(activities: Dictionary<IMapBase>): IMapBase
        {
            var key: string = Object.keys(activities)[0];
            return activities[key];
        }

        /**
         * _GetNextActivity returns the next Activity or null.
         */
        private static _GetNextActivity(activity: IMapBase, activities: Dictionary<IMapBase>): IMapBase
        {
            if (activity == null)
            {
                return null;
            }

            if ((<ActivityMap>activity).next != null)
            {
                return activities[(<ActivityMap>activity).next] || null
            }

            return null;
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