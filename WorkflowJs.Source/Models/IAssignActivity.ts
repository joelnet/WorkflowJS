module wfjs
{
    export interface IAssignActivity extends IActivityBase
    {
        values: Dictionary<any>;
        next?: string;
    }
} 