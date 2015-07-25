module wfjs
{
    export interface IFlowchartMap
    {
        $inputs?: string[];
        $outputs?: string[];
        $extensions?: Dictionary<any>;
        activities: wfjs.Dictionary<IMapBase>;
    }

    export interface IMapBase
    {
    }

    export interface InternalMapBase extends IMapBase
    {
        _type: string;
    }

    export interface ActivityMap extends IMapBase
    {
        activity: wfjs.IActivity;
        $inputs?: Dictionary<string>;
        $outputs?: Dictionary<string>;
        next: string;
    }

    export interface IDecisionActivity extends IMapBase
    {
        condition: string;
        ontrue: string;
        onfalse: string;
        next: string;
    }
} 