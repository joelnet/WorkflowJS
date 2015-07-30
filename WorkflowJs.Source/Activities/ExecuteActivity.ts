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
            if (_Specifications.IsExecuteAsync.IsSatisfiedBy(this._options.execute))
            {
                this._options.execute(context, done);
            }
            else
            {
                this._options.execute(context);

                if (done != null)
                {
                    done();
                }
            }
        }
    }
}