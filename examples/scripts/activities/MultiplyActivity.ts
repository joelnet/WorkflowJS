module wfjs.Activities
{
    export class MultiplyActivity implements wfjs.Activity
    {
        public $inputs = ['number1', 'number2'];
        public $outputs = ['total'];

        public Execute(context: wfjs.ActivityContext, done: (err?: Error) => void): void
        {
            var number1: number = context.Inputs['number1'];
            var number2: number = context.Inputs['number2'];

            context.Outputs['total'] = number1 * number2;

            done();
        }
    }
}