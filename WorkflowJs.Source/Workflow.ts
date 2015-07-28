module wfjs
{
    export interface IInternalWorkflow
    {
        _stateData: IPauseState;
    }

    export class Workflow implements IActivity
    {
        public $inputs: string[];
        public $outputs: string[];
        public State: WorkflowState = WorkflowState.None;
        public logger: Console = console;

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
            this.State = context.State = WorkflowState.Running;

            var firstActivityName: string = _bll.Workflow.GetStartActivityName(this._activities, this._stateData);
            var activity = this._activities[firstActivityName];

            if (activity == null)
            {
                this.State = context.State = WorkflowState.Complete;
                return done();
            }

            if (this._stateData != null)
            {
                this._log(LogType.None, 'Workflow Resumed');
            }

            this._ExecuteLoop(firstActivityName, context, activity, err =>
            {
                if (_Specifications.IsPaused.IsSatisfiedBy(context))
                {
                    this._log(LogType.None, 'Workflow Paused');
                    this.State = context.State = WorkflowState.Paused;
                }
                else if (err != null)
                {
                    this.State = context.State = WorkflowState.Fault;
                }
                else
                {
                    this.State = context.State = WorkflowState.Complete;
                }

                done(err);
            });
        }

        /**
         * _ExecuteLoop Execution loop that executes every Activity.
         */
        private _ExecuteLoop(activityName: string, context: ActivityContext, activity: IActivityBase, done: (err?: Error) => void): void
        {
            var innerContext = Workflow._CreateNextActivityContext(context);

            var next = (err, innerContext: ActivityContext) =>
            {
                if (err != null)
                {
                    return done(err);
                }

                var $next: string = ObjectHelper.GetValue(innerContext, 'Outputs', '$next');
                var nextActivityName: string = $next || _bll.Workflow.GetNextActivityName(activity, this._activities);
                var nextActivity = !_Specifications.IsPaused.IsSatisfiedBy(innerContext) ? this._activities[nextActivityName] : null;
                var dummyCallback = (n, i, a, callback) => { callback(); };
                var activityExecute = nextActivity != null ? this._ExecuteLoop.bind(this) : dummyCallback;

                activityExecute(nextActivityName, innerContext, nextActivity, err =>
                {
                    ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    
                    if (_Specifications.IsPaused.IsSatisfiedBy(innerContext))
                    {
                        context.StateData = innerContext.StateData;
                    }

                    done(err);
                });
            }

            if ((<IWorkflowActivity>activity).activity != null)
            {
                var inputs = ObjectHelper.ShallowClone(innerContext.Inputs);

                this._ExecuteActivity(innerContext, <IInternalWorkflowActivity>activity, err =>
                {
                    this._log(LogType.None, activityName, {
                        inputs: inputs,
                        outputs: innerContext.Outputs,
                        err: err
                    });

                    next(err, innerContext);
                });
            }
            else
            {
                this._log(LogType.Error, activityName + ': ' + Resources.Error_Activity_Invalid);
                done(new Error(Resources.Error_Activity_Invalid));
            }
        }

        /**
         * _ExecuteActivity Executes the Activity.
         */
        private _ExecuteActivity(context: ActivityContext, activity: IInternalWorkflowActivity, done: (err?: Error) => void): void
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
                     
                        if (_Specifications.IsPaused.IsSatisfiedBy(innerContext))
                        {
                           context.StateData = innerContext.StateData;
                        }
                    }

                    done(err);
                });
        }

        private _log(logType: LogType, message: any, ...optionalParams: any[]): void
        {
            var args = [this.logger, logType, 'wfjs.Workflow:']
                .concat([message])
                .concat(optionalParams || []);

            _bll.Logger.Log.apply(_bll.Logger, args);
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