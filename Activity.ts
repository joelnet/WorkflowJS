module wfjs
{
    export interface IActivity
    {
        $inputs?: string[];
        $outputs?: string[];
        Execute(context: ActivityContext, done: (err?: Error) => void): void;
    }

    export interface IWorkflowActivity
    {
        activity: IActivity;
        $inputs?: Dictionary<any>;
        $outputs?: Dictionary<string>;
        next?: string;
    }

    export var Activity = (options: IWorkflowActivity) =>
    {
        return options;
    }
}