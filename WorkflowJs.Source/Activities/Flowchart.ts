module wfjs
{
    export function Flowchart(options: IFlowchart): IActivity;
    export function Flowchart(options: IFlowchart, state?: IPauseState): IActivity;
    export function Flowchart(options: IFlowchart, state?: IPauseState): IActivity
    {
        return new FlowchartActivity(options);
    };

    export class FlowchartActivity implements IActivity
    {
        public $inputs: string[];
        public $outputs: string[];
        public State: WorkflowState = WorkflowState.None;
        public logger: Console = console;

        private _activities: Dictionary<IActivityBase>;
        private _extensions: Dictionary<any>;
        private _stateData: IPauseState;

        constructor(flowchart: IFlowchart, state?: IPauseState)
        {
            flowchart = flowchart || <IFlowchart>{};
            flowchart.activities = flowchart.activities || {};

            this.$inputs = flowchart.$inputs || [];
            this.$outputs = flowchart.$outputs || [];
            this._activities = flowchart.activities || {};
            this._extensions = flowchart.$extensions || {};
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
                this._log(LogType.None, 'Workflow Complete');
                this.State = context.State = WorkflowState.Complete;
                return done();
            }

            if (this._stateData != null)
            {
                this._log(LogType.None, 'Workflow Resumed');
            }

            this._ExecuteNextActivity(firstActivityName, context, activity, err =>
            {
                if (err != null)
                {
                    context.State = WorkflowState.Fault;
                }
                else
                {
                    context.State = this.State == WorkflowState.Running ? WorkflowState.Complete : this.State;
                }

                switch (context.State)
                {
                    case WorkflowState.Complete: this._log(LogType.None, 'Workflow Complete'); break;
                    case WorkflowState.Fault: this._log(LogType.None, 'Workflow Faulted'); break;
                    case WorkflowState.Paused: this._log(LogType.None, 'Workflow Paused'); break;
                    case WorkflowState.Running: this._log(LogType.None, 'Workflow Running'); break;
                }

                done(err);
            });
        }

        /**
         * _ExecuteNextActivity Execution loop that executes every Activity.
         */
        private _ExecuteNextActivity(activityName: string, context: ActivityContext, activity: IActivityBase, done: (err?: Error) => void): void
        {
            if (activity == null)
            {
                return done();
            }

            var innerContext = _bll.Workflow.CreateChildActivityContext(context);

            if (_Specifications.IsWorkflowActivity.IsSatisfiedBy(activity))
            {
                this._ExecuteActivity(activityName, innerContext, <IWorkflowActivity>activity, err =>
                {
                    if (err != null)
                    {
                        this.State = WorkflowState.Fault;
                        return done(err);
                    }

                    var nextActivityName: string = _bll.Workflow.GetNextActivityName(activity, innerContext, this._activities);
                    var nextActivity = this._activities[nextActivityName] || null;

                    if (_Specifications.IsPaused.IsSatisfiedBy(innerContext))
                    {
                        context.StateData = _bll.Workflow.GetPauseState(context, nextActivityName);
                        this.State = innerContext.State;
                        return done();
                    }

                    this._ExecuteNextActivity(nextActivityName, innerContext, nextActivity, err =>
                    {
                        ObjectHelper.CopyProperties(innerContext.Outputs, context.Outputs);
                    
                        if (_Specifications.IsPaused.IsSatisfiedBy(innerContext))
                        {
                            context.StateData = innerContext.StateData;
                        }

                        done(err);
                    });
                });
            }
            else
            {
                this._log(LogType.Error, activityName + ': ' + Resources.Error_Activity_Invalid);
                done(new Error(Resources.Error_Activity_Invalid));
            }
        }

        /**
         * _ExecuteActivity Calls WorkflowInvoker to execute the Activity.
         */
        private _ExecuteActivity(activityName: string, context: ActivityContext, activity: IWorkflowActivity, done: (err?: Error) => void): void
        {
            var inputs = _bll.Workflow.GetInputs(context, activity.$inputs);

            WorkflowInvoker
                .CreateActivity(activity.activity)
                .Extensions(context.Extensions)
                .Inputs(inputs)
                .Invoke((err, innerContext) =>
                {
                    _bll.Workflow.CopyInnerContextToOuterContext(innerContext, context, activity);

                    this._log(LogType.None, activityName, ObjectHelper.TrimObject({
                        inputs: inputs,
                        outputs: ObjectHelper.ShallowClone(ObjectHelper.GetValue(innerContext, 'Outputs')),
                        err: err
                    }));

                    done(err);
                });
        }

        /**
         * Helper method for logging
         */
        private _log(logType: LogType, message: any, ...optionalParams: any[]): void
        {
            var args = [this.logger, logType, 'wfjs.Workflow:']
                .concat([message])
                .concat(optionalParams || []);

            _bll.Logger.Log.apply(_bll.Logger, args);
        }
    }
}