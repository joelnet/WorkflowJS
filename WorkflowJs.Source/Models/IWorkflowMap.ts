module wfjs
{
    export interface IActivityBase
    {
    }

    export interface InternalActivityBase extends IActivityBase
    {
        _type: string;
    }

    export interface IDecisionActivity extends IActivityBase
    {
        condition: string;
        ontrue: string;
        onfalse: string;
        next: string;
    }
} 