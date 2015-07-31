module wfjs
{
    export function Decision(options: IDecisionActivity)
    {
        options = options || <IDecisionActivity>{};

        return Execute({
            execute: (context: ActivityContext) =>
            {
                var result = _EvalHelper.Eval(context.Inputs, options.condition);
                
                context.Outputs['$next'] = result ? options.true : options.false;
            },
            next: _ObjectHelper.GetValue<string>(options, 'next')
        });
    };
}