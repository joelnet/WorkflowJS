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
            context.StateData = {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            };

            done();
        }

        public Resume(context: ActivityContext, state: IPauseState): void
        {
            throw new Error('Not Implemented');

            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        }
    }
}