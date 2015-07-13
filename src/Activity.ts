module wfjs
{
    export interface Activity
    {
        $inputs: string[];
        $outputs: string[];
        Execute(context: ActivityContext, done: (err: Error) => void): void;
    }
} 