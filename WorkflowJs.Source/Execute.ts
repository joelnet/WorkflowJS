module wfjs
{
    export interface IExecuteActivity extends IMapBase
    {
        execute: (context: ActivityContext, done: (err?: Error) => void) => void;
        next?: string;
    }

    export var Execute = (options: IExecuteActivity) =>
    {
        return options;
    };
}