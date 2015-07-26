module wfjs
{
    export interface IDecisionActivity extends IActivityBase
    {
        condition: string;
        true: string;
        false: string;
        next?: string;
    }
}