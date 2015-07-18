module wfjs
{
    export interface IFlowchartMap
    {
        $inputs?: string[];
        $outputs?: string[];
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<MapBase>;
    }

    export interface MapBase
    {
    }

    export interface ActivityMap extends MapBase
    {
        activity: wfjs.Activity;
        $inputs?: Dictionary<ActivityInputMap>;
        $outputs?: Dictionary<string>;
        next: string;
    }

    export interface IDecisionActivity extends MapBase
    {
        condition: string;
        ontrue: string;
        onfalse: string;
        next: string;
    }

    export interface IAssignActivity extends MapBase
    {
        value: string;
        output: string;
        next: string;
    }

    export interface ActivityInputMap
    {
        name?: any;
        value?: any;
    }
} 