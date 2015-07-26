module wfjs
{
    export interface IFlowchart
    {
        $inputs?: string[];
        $outputs?: string[];
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<IActivityBase>;
    }
}  