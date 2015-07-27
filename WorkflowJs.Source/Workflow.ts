module wfjs
{
    export interface IInternalWorkflow
    {
        _stateData: IPauseState;
    }

    export class Workflow implements IActivity
    {
        public debug: boolean = true;
        public $inputs: string[];
        public $outputs: string[];
        public State: WorkflowState = WorkflowState.None;

        private _activities: Dictionary<IActivityBase>;
        private _extensions: Dictionary<any>;
        private _stateData: IPauseState;

        constructor(map: IFlowchart, state?: IPauseState)
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
            this._stateData = state || null;
        }

        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            this.State = WorkflowState.Running;

            var activityCount = Object.keys(this._activities).length;

            if (activityCount == 0)
            {
                return done();
            }

            var activity = Workflow._GetFirstActivity(this._activities, this._stateData);

            this._ExecuteLoop(context, activity, err =>
            {
                if (_Specifications.IsPaused.IsSatisfiedBy(context))
                {
                    this.State = WorkflowState.Paused;
                }
                else if (err != null)
                {
                    this.State = WorkflowState.Fault;
                }
                else
                {
                    this.State = WorkflowState.Complete;
                }
                
                done(err);
            });
        }

        /**
         * _ExecuteLoop Execution loop that executes every Activity.
         */
        private _ExecuteLoop(context: ActivityContext, activity: IActivityBase, done: (err?: Error) => void): void
        {
            var innerContext = Workflow._CreateNextActivityContext(context);

            var next = (err, innerContext: ActivityContext) =>
            {
                if (err != null)
                {
                    return done(err);
                }
                
                var nextActivity = !_Specifications.IsPaused.IsSatisfiedBy(innerContext)
                    ? Workflow._GetNextActivity(activity, this._activities)
                    : null;
                var activityExecute = nextActivity != null
                    ? this._ExecuteLoop.bind(this)
                    : (innerContext, nextActivity, callback) => { callback(); };

                activityExecute(innerContext, nextActivity, err =>
                {
                    ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    
                    if (_Specifications.IsPaused.IsSatisfiedBy(innerContext))
                    {
                        context.StateData = innerContext.StateData;
                    }

                    done(err);
                });
            }

            // TODO: use InternalMapBase globally.
            var iActivity = <IInternalActivityBase>activity;

            if (this.debug)
            {
                console.log('Activity:', iActivity);
            }

            if ((<IWorkflowActivity>activity).activity != null)
            {
                this._ExecuteActivity(innerContext, <IWorkflowActivity>activity, err => next(err, innerContext));
            }
            else if ((<IDecisionActivity>activity).condition != null)
            {
                this._ExecuteDecision(context, <IDecisionActivity>activity, err => next(err, context));
            }
            else if ((<IExecuteActivity>activity).execute != null)
            {
                this._ExecuteCodeActivity(context, <IExecuteActivity>activity, err => next(err, context));
            }
            else if (iActivity._type == 'pause')
            {
                this._ExecutePause(context, <PauseActivity>activity, err => next(err, context));
            }
            else
            {
                done(new Error(Resources.Error_Activity_Invalid));
            }
        }

        /**
         * _ExecutePause Pause / Resume the workflow.
         */
        private _ExecutePause(context: ActivityContext, activity: PauseActivity, done: (err: Error) => void): void
        {
            var err: Error = null;

            try
            {
                context.StateData = activity.Pause(context);
            }
            catch (ex)
            {
                err = ex;
            }

            done(err);
        }

        /**
         * _ExecuteActivity Executes the Activity.
         */
        private _ExecuteActivity(context: ActivityContext, activity: IWorkflowActivity, done: (err?: Error) => void): void
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

                activity.next = condition ? activity.true : activity.false;
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
         * _GetInputs Returns a collection of input values.
         */
        private static _GetInputs(context: ActivityContext, inputs: Dictionary<any>): Dictionary<any>
        {
            var value: Dictionary<any> = {};

            var allValues: Dictionary<any> = ObjectHelper.CombineObjects(context.Inputs, context.Outputs);

            if (_Specifications.IsWildcardDictionary.IsSatisfiedBy(inputs))
            {
                return allValues;
            }

            for (var key in inputs)
            {
                value[key] = EvalHelper.Eval(allValues, inputs[key]);
            }

            return value;
        }

        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        private static _GetOutputs(context: ActivityContext, outputs: Dictionary<string>): Dictionary<any>
        {
            outputs = outputs || {};

            var value: Dictionary<any> = {};

            if (_Specifications.IsWildcardDictionary.IsSatisfiedBy(outputs))
            {
                return ObjectHelper.ShallowClone(context.Outputs);
            }

            for (var key in outputs)
            {
                var v = outputs[key];
                value[v] = context.Outputs[key];
            }

            return value;
        }

        /**
         * _GetFirstActivity Gets the Activity to be executed first.
         */
        private static _GetFirstActivity(activities: Dictionary<IActivityBase>, state: IPauseState): IActivityBase
        {
            var hasStateNext = state != null && state.n != null;
            var activityName: string = hasStateNext ? state.n : Object.keys(activities)[0];

            return activities[activityName];
        }

        /**
         * _GetNextActivity returns the next Activity or null.
         */
        private static _GetNextActivity(activity: IActivityBase, activities: Dictionary<IActivityBase>): IActivityBase
        {
            if (activity == null)
            {
                return null;
            }

            if ((<IWorkflowActivity>activity).next != null)
            {
                return activities[(<IWorkflowActivity>activity).next] || null
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