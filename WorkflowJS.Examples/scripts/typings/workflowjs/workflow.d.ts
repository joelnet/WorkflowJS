declare module wfjs {
    class EvalHelper {
        static Eval(thisArg: any, code: string): any;
    }
}
declare module wfjs {
    class ObjectHelper {
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
    class Specification<T> {
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
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
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
        static GetNextActivityName(activity: IActivityBase, activities: Dictionary<IActivityBase>): string;
    }
}
declare module wfjs {
    var Activity: (options: IWorkflowActivity) => IWorkflowActivity;
}
declare module wfjs {
    var Assign: (options: IAssignActivity) => IWorkflowActivity;
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
    var Decision: (options: IDecisionActivity) => IWorkflowActivity;
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
    var Execute: (options: IExecuteActivity) => IWorkflowActivity;
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
    var Flowchart: (options: IFlowchart) => IFlowchart;
}
declare module wfjs {
    interface IPauseOptions {
        next: string;
    }
    var Pause: (options: IPauseOptions) => IWorkflowActivity;
    class PauseActivity implements IActivityBase {
        $inputs: string[];
        $outputs: string[];
        next: string;
        constructor(options: IPauseOptions);
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }
}
declare module wfjs {
    var Resources: {
        Error_Argument_Null: string;
        Error_Activity_Argument_Null: string;
        Error_Activity_Invalid: string;
    };
}
declare module wfjs {
    class _Specifications {
        static IsPaused: Specification<ActivityContext>;
        static IsWildcardDictionary: Specification<Dictionary<any>>;
        static IsWildcardArray: Specification<string[]>;
        static Has$next: Specification<ActivityContext>;
    }
}
declare module wfjs {
    interface IInternalWorkflow {
        _stateData: IPauseState;
    }
    class Workflow implements IActivity {
        $inputs: string[];
        $outputs: string[];
        State: WorkflowState;
        logger: Console;
        private _activities;
        private _extensions;
        private _stateData;
        constructor(map: IFlowchart, state?: IPauseState);
        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
        /**
         * _ExecuteNextActivity Execution loop that executes every Activity.
         */
        private _ExecuteNextActivity(activityName, context, activity, done);
        /**
         * _ExecuteActivity Executes the Activity.
         */
        private _ExecuteActivity(activityName, context, activity, done);
        private _log(logType, message, ...optionalParams);
        /**
         * _GetInputs Returns a collection of input values.
         */
        private static _GetInputs(context, inputs);
        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        private static _GetOutputs(context, outputs);
        /**
         * _CreateNextActivityContext Returns a new context for inner activities.
         */
        private static _CreateNextActivityContext(context);
    }
}
declare module wfjs {
    class WorkflowInvoker {
        private _activity;
        private _inputs;
        private _extensions;
        private _stateData;
        constructor(activity: IActivity | IFlowchart);
        static CreateActivity(activity: IActivity | IFlowchart): WorkflowInvoker;
        Inputs(inputs: Dictionary<any>): WorkflowInvoker;
        State(state: IPauseState): WorkflowInvoker;
        Extensions(extensions: Dictionary<any>): WorkflowInvoker;
        Invoke(callback?: (err: Error, context?: ActivityContext) => void): void;
        private static _InvokeActivity(activity, inputs, state, extensions, callback);
        private static _CreateContext(activity, inputs, state, extensions, callback);
        private static _CreateStateContext(activity, inputs, state, extensions);
        private static _GetValueDictionary(keys, values, valueType, callback);
    }
}
