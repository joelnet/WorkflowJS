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

    export interface ActivityMap extends IMapBase
    {
        activity: wfjs.Activity;
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

    export interface IAssignActivity extends IMapBase
    {
        value: string;
        output: string;
        next: string;
    }

    export interface ISwitchActivity extends IMapBase
    {
        switch: string;
        case: Dictionary<IMapBase>;
        null: IMapBase;
        default: IMapBase;
        next: string;
    }

    export interface IExecuteActivity extends IMapBase
    {
        execute: (context: ActivityContext, done: (err?: Error) => void) => void;
        next?: string;
    }
} 