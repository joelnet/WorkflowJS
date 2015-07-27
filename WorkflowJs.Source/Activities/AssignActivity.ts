module wfjs
{
    export var Assign = (options: IAssignActivity) =>
    {
        options = options || <IAssignActivity>{};

        return <IWorkflowActivity>{
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new AssignActivity(options.values),
            next: options.next
        };
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
            try
            {
                var values: Dictionary<any> = ObjectHelper.CombineObjects(context.Inputs, context.Outputs);

                for (var key in this._values)
                {
                    context.Outputs[key] = EvalHelper.Eval(values, this._values[key]);
                }

                done();
            }
            catch (ex)
            {
                done(ex);
            }
        }
    }
}