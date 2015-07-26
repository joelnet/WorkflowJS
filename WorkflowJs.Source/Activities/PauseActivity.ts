module wfjs
{
    export interface IPauseOptions
    {
        next: string;
    }

    export var Pause = (options: IPauseOptions) =>
    {
        return new PauseActivity(options);
    };

    export class PauseActivity implements IActivityBase
    {
        private _type = 'pause';

        public next: string;

        constructor(options: IPauseOptions)
        {
            if (options != null)
            {
                this.next = options.next;
            }
        }

        public Pause(context: ActivityContext): IPauseState
        {
            return {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            }
        }

        public Resume(context: ActivityContext, state: IPauseState): void
        {
            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        }
    }
} 