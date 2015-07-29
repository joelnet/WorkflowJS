module wfjs
{
    export interface IPauseOptions
    {
        next: string;
    }

    export var Pause = (options: IPauseOptions) =>
    {
        options = options || <IPauseOptions>{};

        return Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new PauseActivity(options),
            next: options.next
        });
    };

    export class PauseActivity implements IActivityBase
    {
        public $inputs: string[] = ['*'];
        public $outputs: string[] = ['*'];
        public next: string;

        constructor(options: IPauseOptions)
        {
            if (options != null)
            {
                this.next = options.next;
            }
        }

        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            context.State = WorkflowState.Paused;

            done();
        }
    }
}