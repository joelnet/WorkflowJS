declare module wfjs {
    class _EvalHelper {
        static Eval(thisArg: any, code: string): any;
    }
}
declare module wfjs {
    class _FunctionHelper {
        static ParameterCount(fn: Function): number;
        /**
         * FormalParameterList returns a string array of parameter names
         */
        static FormalParameterList(fn: Function): string[];
    }
}
declare module wfjs {
    class _ObjectHelper {
        static CopyProperties(source: any, destination: any): void;
        static GetKeys(obj: any): string[];
        static GetValue<T>(obj: any, ...params: any[]): T;
        static ShallowClone(obj: any): any;
        static CombineObjects(obj1: any, obj2: any): any;
        /**
         * TrimObject Returns the a shallow clone of the object (excluding any values that are null, undefined or have no keys).
         */
        static TrimObject<T>(obj: T): T;
        private static ShallowCloneArray(obj);
        private static ShallowCloneObject(obj);
    }
}
declare module wfjs {
    class _Specification<T> {
        private _criteria;
        constructor(criteria: (obj: T) => boolean);
        IsSatisfiedBy(value: T): boolean;
    }
}
declare module wfjs {
    interface ActivityContextOptions {
        Extensions?: Dictionary<any>;
        Inputs?: Dictionary<any>;
        Outputs?: Dictionary<any>;
    }
    class ActivityContext {
        Extensions: Dictionary<any>;
        Inputs: Dictionary<any>;
        Outputs: Dictionary<any>;
        StateData: any;
        State: WorkflowState;
        constructor(options: ActivityContextOptions);
    }
}
declare module wfjs {
    interface Dictionary<T> {
        [key: string]: T;
    }
}
declare module wfjs {
    interface IActivity {
        $inputs?: string[];
        $outputs?: string[];
        Execute(context: ActivityContext, done?: (err?: Error) => void): void;
    }
}
declare module wfjs {
    interface IActivityBase {
    }
}
declare module wfjs {
    interface IAssignActivity extends IActivityBase {
        values: Dictionary<any>;
        next?: string;
    }
}
declare module wfjs {
    interface IDecisionActivity extends IActivityBase {
        condition: string;
        true: string;
        false: string;
        next?: string;
    }
}
declare module wfjs {
    interface IExecuteActivity extends IActivityBase {
        execute: (context: ActivityContext, done: (err?: Error) => void) => void;
        next?: string;
    }
}
declare module wfjs {
    interface IFlowchart {
        $inputs?: string[];
        $outputs?: string[];
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<IActivityBase>;
    }
}
declare module wfjs {
    interface IInternalWorkflow {
        _stateData: IPauseState;
    }
}
declare module wfjs {
    interface IPauseState {
        i: wfjs.Dictionary<any>;
        o: wfjs.Dictionary<any>;
        n: string;
    }
}
declare module wfjs {
    interface IWorkflowActivity {
        activity: IActivity;
        $inputs?: Dictionary<any>;
        $outputs?: Dictionary<string>;
        next?: string;
    }
}
declare module wfjs {
    enum LogType {
        None = 0,
        Debug = 1,
        Info = 2,
        Warn = 3,
        Error = 4,
    }
}
declare module wfjs {
    enum WorkflowState {
        None = 0,
        Running = 1,
        Complete = 2,
        Paused = 3,
        Fault = 4,
    }
}
declare module wfjs._bll {
    class Logger {
        /**
         * _log Sends message and optionalParams to the logger.
         */
        static Log(logger: Console, logType: LogType, message: any, ...optionalParams: any[]): void;
        /**
         * _getLogFunction returns the log function for the LogType. Falls back to 'log' if others aren't available.
         */
        private static _getLogFunction(logger, logType);
    }
}
declare module wfjs._bll {
    class Workflow {
        /**
          * GetStartActivityName Gets the name of the to be executed first.
          */
        static GetStartActivityName(activities: Dictionary<IActivityBase>, state: IPauseState): string;
        /**
         * GetNextActivityName returns the name of the next Activity or null.
         */
        static GetNextActivityName(activity: IActivityBase, context: ActivityContext, activities: Dictionary<IActivityBase>): string;
        /**
         * GetInputs Returns a collection of input values.
         */
        static GetInputs(context: ActivityContext, inputs: Dictionary<any>): Dictionary<any>;
        /**
         * GetOutputs Returns a collection out remapped outputs
         */
        static GetOutputs(context: ActivityContext, outputs: Dictionary<string>): Dictionary<any>;
        /**
         * CreateContext Creates a new Context for the Activity.
         */
        static CreateContext(activity: IActivity, inputs: Dictionary<any>, state: IPauseState, extensions: Dictionary<any>, callback: (err: Error, context: ActivityContext) => void): void;
        /**
         * GetValueDictionary Returns a Dictionary<any> from 'values' that have matching 'keys'.
         */
        static GetValueDictionary(keys: string[], values: Dictionary<any>, valueType: string, callback: (err: Error, values?: Dictionary<any>) => void): void;
        /**
         * CreateChildActivityContext Returns a new context for inner activities.
         */
        static CreateChildActivityContext(context: ActivityContext): ActivityContext;
        /**
         * CopyInnerContextToOuterContext Copies the outputs of innerContext to the outerContext.
         */
        static CopyInnerContextToOuterContext(innerContext: ActivityContext, outerContext: ActivityContext, activity: IWorkflowActivity): void;
        /**
         * GetPauseState Returns an IPauseState from the ActivityContext and nextActivityName.
         */
        static GetPauseState(context: ActivityContext, nextActivityName: string): IPauseState;
    }
}
declare module wfjs {
    function Activity(options: IWorkflowActivity): IWorkflowActivity;
}
declare module wfjs {
    function Assign(options: IAssignActivity): IWorkflowActivity;
    /**
     * AssignActivity Assigns values to Outputs.
     */
    class AssignActivity implements IActivity {
        $inputs: string[];
        $outputs: string[];
        private _values;
        constructor(values: Dictionary<any>);
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }
}
declare module wfjs {
    function Decision(options: IDecisionActivity): IWorkflowActivity;
    /**
     * AssignActivity Assigns values to Outputs.
     */
    class DecisionActivity implements IActivity {
        $inputs: string[];
        $outputs: string[];
        private _options;
        constructor(options: IDecisionActivity);
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }
}
declare module wfjs {
    function Execute(options: IExecuteActivity): IWorkflowActivity;
    /**
     * AssignActivity Assigns values to Outputs.
     */
    class ExecuteActivity implements IActivity {
        $inputs: string[];
        $outputs: string[];
        private _options;
        constructor(options: IExecuteActivity);
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }
}
declare module wfjs {
    function Flowchart(options: IFlowchart): IActivity;
    function Flowchart(options: IFlowchart, state?: IPauseState): IActivity;
    class FlowchartActivity implements IActivity {
        $inputs: string[];
        $outputs: string[];
        State: WorkflowState;
        logger: Console;
        private _activities;
        private _extensions;
        private _stateData;
        constructor(flowchart: IFlowchart, state?: IPauseState);
        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
        /**
         * _ExecuteNextActivity Execution loop that executes every Activity.
         */
        private _ExecuteNextActivity(activityName, context, activity, done);
        /**
         * _ExecuteActivity Calls WorkflowInvoker to execute the Activity.
         */
        private _ExecuteActivity(activityName, context, activity, done);
        /**
         * Helper method for logging
         */
        private _log(logType, message, ...optionalParams);
    }
}
declare module wfjs {
    interface IPauseOptions {
        next: string;
    }
    function Pause(options: IPauseOptions): IWorkflowActivity;
    class PauseActivity implements IActivityBase {
        $inputs: string[];
        $outputs: string[];
        next: string;
        constructor(options: IPauseOptions);
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }
}
interface NodeModule {
}
declare var module: NodeModule;
declare module wfjs {
    var Resources: {
        Error_Argument_Null: string;
        Error_Activity_Argument_Null: string;
        Error_Activity_Invalid: string;
    };
}
declare module wfjs {
    /**
     * _Specifications Specification Pattern test for commonly used conditions.
     */
    class _Specifications {
        static IsPaused: _Specification<ActivityContext>;
        static IsWildcardDictionary: _Specification<Dictionary<any>>;
        static IsWildcardArray: _Specification<string[]>;
        static Has$next: _Specification<ActivityContext>;
        static IsWorkflowActivity: _Specification<IActivityBase>;
        static IsExecutableActivity: _Specification<IActivity | IFlowchart>;
        static IsExecuteAsync: _Specification<Function>;
    }
}
declare module wfjs {
    /**
     * WorkflowInvoker Activity or Workflow runner.
     */
    class WorkflowInvoker {
        private _activity;
        private _inputs;
        private _extensions;
        private _stateData;
        /**
         * CreateActivity Returns a WorkflowInvoker with attached activity.
         */
        constructor(activity: IActivity | IFlowchart);
        /**
         * CreateActivity Returns a WorkflowInvoker with attached activity.
         */
        static CreateActivity(activity: IActivity | IFlowchart): WorkflowInvoker;
        /**
         * Inputs Sets the inputs for the IActivity.
         */
        Inputs(inputs: Dictionary<any>): WorkflowInvoker;
        /**
         * State Sets the IPauseState for the IActivity.
         */
        State(state: IPauseState): WorkflowInvoker;
        /**
         * Extensions Sets the extensions for the IActivity.
         */
        Extensions(extensions: Dictionary<any>): WorkflowInvoker;
        /**
         * Invoke Executes the IActivity and returns an error or context.
         */
        Invoke(callback?: (err: Error, context?: ActivityContext) => void): void;
        /**
         * _InvokeActivity Creates an ActivityContext for the IActivity and calls the Execute method.
         */
        private static _InvokeActivity(activity, inputs, state, extensions, callback);
        /**
         * _ActivityExecuteAsync Executes either Asynchronous or Synchronous Activity.
         */
        private static _ActivityExecuteAsync(activity, context, done);
    }
}
