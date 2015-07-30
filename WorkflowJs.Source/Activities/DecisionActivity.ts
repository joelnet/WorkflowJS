module wfjs
{
    export function Decision(options: IDecisionActivity)
    {
        options = options || <IDecisionActivity>{};

        return Activity({
            $inputs: { '*': '*' },
            $outputs: { '$next': '$next' },
            activity: new DecisionActivity(options),
            next: options.next
        });
    };

    /**
     * AssignActivity Assigns values to Outputs.
     */
    export class DecisionActivity implements IActivity
    {
        public $inputs: string[] = ['*'];
        public $outputs: string[] = ['$next'];

        private _options: IDecisionActivity;

        constructor(options: IDecisionActivity)
        {
            this._options = options || <IDecisionActivity>{};
        }

        public Execute(context: ActivityContext, done: (err?: Error) => void): void
        {
            var result = _EvalHelper.Eval(context.Inputs, this._options.condition);
                
            context.Outputs['$next'] = result ? this._options.true : this._options.false;

            done();
        }
    }
}