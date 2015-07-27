module wfjs
{
    export var Decision = (options: IDecisionActivity) =>
    {
        options = options || <IDecisionActivity>{};

        return <IWorkflowActivity>{
            $inputs: { '*': '*' },
            $outputs: { '$next': '$next' },
            activity: new DecisionActivity(options),
            next: options.next
        };
    };

    /**
     * AssignActivity Assigns values to Outputs.
     */
    export class DecisionActivity implements IActivity
    {
        public $inputs: string[] = ['*'];
        public $outputs: string[] = ['$next'];

        private _values: Dictionary<any>;
        private _options: IDecisionActivity;

        constructor(options: IDecisionActivity)
        {
            this._options = options || <IDecisionActivity>{};
        }

        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            // TODO: test if we can use just Inputs or if we have to use Inputs AND Outputs
            var values: Dictionary<any> = ObjectHelper.CombineObjects(context.Inputs, context.Outputs);

            var result = EvalHelper.Eval(values, this._options.condition);
                
            context.Outputs['$next'] = result ? this._options.true : this._options.false;

            done();
        }
    }
}