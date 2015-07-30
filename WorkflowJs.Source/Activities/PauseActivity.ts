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
            execute: null,
            next: _ObjectHelper.GetValue<string>(options, 'next')
        });

        //return Activity({
        //    $inputs: { '*': '*' },
        //    $outputs: { '*': '*' },
        //    activity: new PauseActivity(options),
        //    next: options.next
        //});
    };

    //export class PauseActivity implements IActivityBase
    //{
    //    public $inputs: string[] = ['*'];
    //    public $outputs: string[] = ['*'];
    //    public next: string;

    //    constructor(options: IPauseOptions)
    //    {
    //        if (options != null)
    //        {
    //            this.next = options.next;
    //        }
    //    }

    //    public Execute(context: ActivityContext): void
    //    {
    //        context.State = WorkflowState.Paused;
    //    }
    //}
}