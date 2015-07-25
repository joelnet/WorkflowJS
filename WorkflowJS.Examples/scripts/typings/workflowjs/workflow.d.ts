declare module wfjs {
    class EvalHelper {
        static Eval(thisArg: any, code: string): any;
    }
}
declare module wfjs {
    class ObjectHelper {
        static GetKeys(obj: any): string[];
        static CopyProperties(source: any, destination: any): void;
        static ShallowClone(obj: any): {};
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
    interface IActivity {
        $inputs?: string[];
        $outputs?: string[];
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }
    interface IWorkflowActivity {
        activity: IActivity;
        $inputs?: Dictionary<any>;
        $outputs?: Dictionary<string>;
        next?: string;
    }
    var Activity: (options: IWorkflowActivity) => IWorkflowActivity;
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
    interface IAssignActivity extends IMapBase {
        values: Dictionary<any>;
        next?: string;
    }
    var Assign: (options: IAssignActivity) => IAssignActivity;
}
declare module wfjs {
    interface Dictionary<T> {
        [key: string]: T;
    }
}
declare module wfjs {
    interface IExecuteActivity extends IMapBase {
        execute: (context: ActivityContext, done: (err?: Error) => void) => void;
        next?: string;
    }
    var Execute: (options: IExecuteActivity) => IExecuteActivity;
}
declare module wfjs {
    interface IFlowchartMap {
        $inputs?: string[];
        $outputs?: string[];
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<IMapBase>;
    }
    interface IMapBase {
    }
    interface InternalMapBase extends IMapBase {
        _type: string;
    }
    interface ActivityMap extends IMapBase {
        activity: wfjs.IActivity;
        $inputs?: Dictionary<string>;
        $outputs?: Dictionary<string>;
        next: string;
    }
    interface IDecisionActivity extends IMapBase {
        condition: string;
        ontrue: string;
        onfalse: string;
        next: string;
    }
}
declare module wfjs {
    interface IPauseState {
        i: wfjs.Dictionary<any>;
        o: wfjs.Dictionary<any>;
        n: string;
    }
    interface IPauseOptions {
        next: string;
    }
    var Pause: (options: IPauseOptions) => WorkflowPause;
    class WorkflowPause implements IMapBase {
        private _type;
        next: string;
        constructor(options: IPauseOptions);
        Pause(context: wfjs.ActivityContext): IPauseState;
        Resume(context: wfjs.ActivityContext, state: IPauseState): void;
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
        private _activities;
        private _extensions;
        private _stateData;
        constructor(map: IFlowchartMap, state?: IPauseState);
        /**
         * Execution point that will be entered via WorkflowInvoker.
         */
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
        /**
         * _ExecuteLoop Execution loop that executes every Activity.
         */
        private _ExecuteLoop(context, activity, done);
        /**
         * _ExecutePause Pause / Resume the workflow.
         */
        private _ExecutePause(context, activity, done);
        /**
         * _ExecuteActivity Executes the actual Activity.
         */
        private _ExecuteActivity(context, activity, done);
        /**
         * _ExecuteDecision Evaluates the condition (to true or false) and executes next activity.
         */
        private _ExecuteDecision(context, activity, done);
        /**
         * _ExecuteAssign Assigns a value to an output variable.
         */
        private _ExecuteAssign(context, activity, done);
        /**
         * _ExecuteCodeActivity Executes an IExecuteActivity block.
         */
        private _ExecuteCodeActivity(context, activity, done);
        /**
         * _GetInputs Returns a collection of input values.
         */
        private static _GetInputs(context, inputs);
        /**
         * _GetOutputs Returns a collection out remapped outputs
         */
        private static _GetOutputs(context, outputs);
        /**
         * _GetFirstActivity Gets the Activity to be executed first.
         */
        private static _GetFirstActivity(activities, state);
        /**
         * _GetNextActivity returns the next Activity or null.
         */
        private static _GetNextActivity(activity, activities);
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
        constructor(activity: IActivity | IFlowchartMap);
        static CreateActivity(activity: IActivity | IFlowchartMap): WorkflowInvoker;
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
declare module wfjs {
    enum WorkflowState {
        None = 0,
        Running = 1,
        Complete = 2,
        Paused = 3,
        Fault = 4,
    }
}
