 module wfjs
{
    export interface IActivity
    {
        $inputs?: string[];
        $outputs?: string[];
        Execute(context: ActivityContext, done?: (err?: Error) => void): void;
    }
}