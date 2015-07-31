module wfjs
{
    export function Assign(options: IAssignActivity)
    {
        options = options || <IAssignActivity>{};

        return Execute({
            execute: (context: ActivityContext) =>
            {
                for (var key in (options.values || {}))
                {
                    context.Outputs[key] = _EvalHelper.Eval(context.Inputs, options.values[key]);
                }
            },
            next: _ObjectHelper.GetValue<string>(options, 'next')
        });
    };
}