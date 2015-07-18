module wfjs
{
    export interface IWorkflowMap
    {
        $inputs?: string[];
        $outputs?: string[];
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<ActivityMap>;
    }

    export interface ActivityMap
    {
        activity: wfjs.Activity;
        $inputs?: Dictionary<ActivityInputMap>;
        $outputs?: Dictionary<string>;
        next: string;
    }

    export interface ActivityInputMap
    {
        name?: any;
        value?: any;
    }
} 