module wfjs
{
    export class SerialActivity implements Activity
    {
        $inputs: string[] = null;
        $outputs: string[] = null;

        private _activities: Activity[];

        constructor(activities: Activity[])
        {
            this._activities = activities || [];
        }

        public Execute(context: ActivityContext, done: (err: Error) => void): void
        {
            var internalContext = new ActivityContext({
                Extensions: context.Extensions,
                Inputs: context.Inputs,
                Outputs: context.Outputs
            });

            this.InternalExecute(0, internalContext, err =>
            {
                if (context.Outputs != internalContext.Outputs)
                {
                    context.Outputs = internalContext.Outputs;
                }

                done(err);
            });
        }

        private InternalExecute(index: number, context: ActivityContext, done: (err: Error) => void): void
        {
            var activity = this._activities[index];
            if (activity == null)
            {
                return done(null);
            }

            activity.Execute(context, err =>
            {
                if (err != null)
                {
                    return done(err);
                }

                this.CopyOutputsToInputs(context);
                
                this.InternalExecute(++index, context, done);
            });
        }

        private CopyOutputsToInputs(context: ActivityContext): void
        {
            for (var key in (context.Outputs || {}))
            {
                context.Inputs[key] = context.Outputs[key];
            }
        }
    }
}