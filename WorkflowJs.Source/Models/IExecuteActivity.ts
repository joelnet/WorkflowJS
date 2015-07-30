module wfjs
{
    export interface IExecuteActivity extends IActivityBase
    {
        execute: (context: ActivityContext, done?: (err?: Error) => void) => void;
        next?: string;
    }
} 