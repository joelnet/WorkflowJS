module wfjsExample.Activities
{
    export class DivideAsyncActivity implements wfjs.IActivity
    {
        public $inputs = ['number1', 'number2'];
        public $outputs = ['total'];

        public Execute(context: wfjs.ActivityContext, done: (err?: Error) => void): void
        {
            var number1: number = parseFloat(context.Inputs['number1']) || 0;
            var number2: number = parseFloat(context.Inputs['number2']) || 0;

            this._DivideAsync(number1, number2, (err, total) =>
            {
                context.Outputs['total'] = total;

                done(err);
            });
        }

        private _DivideAsync(number1: number, number2: number, callback: (err: Error, total?: number) => void): void
        {
            setTimeout(() =>
            {
                if (number2 == 0)
                {
                    return callback(new Error('Cannot divide by 0.'));
                }

                callback(null, number1 / number2);
            }, 0);
        }
    }
}