module wfjs
{
    export function Assign(options: IAssignActivity)
    {
        options = options || <IAssignActivity>{};

        return Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new AssignActivity(options.values),
            next: options.next
        });
    };

    /**
     * AssignActivity Assigns values to Outputs.
     */
    export class AssignActivity implements IActivity
    {
        public $inputs: string[] = ['*'];
        public $outputs: string[] = ['*'];

        private _values: Dictionary<any>;

        constructor(values: Dictionary<any>)
        {
            this._values = values || {};
        }

        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            for (var key in this._values)
            {
                context.Outputs[key] = _EvalHelper.Eval(context.Inputs, this._values[key]);
            }

            done();
        }
    }
}