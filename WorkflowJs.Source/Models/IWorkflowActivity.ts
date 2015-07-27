module wfjs
{
    export interface IWorkflowActivity
    {
        activity: IActivity;
        $inputs?: Dictionary<any>;
        $outputs?: Dictionary<string>;
        next?: string;
    }

    export interface IInternalWorkflowActivity extends IWorkflowActivity
    {
        _name: string;
    }
 }