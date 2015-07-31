module wfjs
{
    export interface IPauseOptions
    {
        next: string;
    }

    export function Pause(options: IPauseOptions)
    {
        options = options || <IPauseOptions>{};

        return Execute({
            execute: (context: ActivityContext) =>
            {
                context.State = WorkflowState.Paused;
            },
            next: _ObjectHelper.GetValue<string>(options, 'next')
        });
    };
}