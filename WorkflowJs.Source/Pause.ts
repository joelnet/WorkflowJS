module wfjs
{
    export interface IPauseState
    {
        i: wfjs.Dictionary<any>;
        o: wfjs.Dictionary<any>;
        n: string;
    }

    export interface IPauseOptions
    {
        next: string;
    }

    export var Pause = (options: IPauseOptions) =>
    {
        return new WorkflowPause(options);
    };

    export class WorkflowPause implements IMapBase
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

        public Pause(context: wfjs.ActivityContext): IPauseState
        {
            return {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            }
        }

        public Resume(context: wfjs.ActivityContext, state: IPauseState): void
        {
            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        }
    }
} 