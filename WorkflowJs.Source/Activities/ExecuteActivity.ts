module wfjs
{
    export function Execute(options: IExecuteActivity)
    {
        options = options || <IExecuteActivity>{};

        return Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new ExecuteActivity(options),
            next: options.next
        });
    };

    /**
     * AssignActivity Assigns values to Outputs.
     */
    export class ExecuteActivity implements IActivity
    {
        public $inputs: string[] = ['*'];
        public $outputs: string[] = ['*'];

        private _options: IExecuteActivity;

        constructor(options: IExecuteActivity)
        {
            this._options = options || <IExecuteActivity>{};
        }

        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            this._options.execute(context, done);
        }
    }
}