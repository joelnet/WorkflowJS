module wfjs
{
    export interface IFlowchart
    {
        $inputs?: string[];
        $outputs?: string[];
// TODO: eliminate extensions from IFlowchart
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<IActivityBase>;
    }
}  