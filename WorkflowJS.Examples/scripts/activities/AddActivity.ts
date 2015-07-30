module wfjsExample.Activities
{
    export class AddActivity implements wfjs.IActivity
    {
        public $inputs = ['number1', 'number2'];
        public $outputs = ['total'];

        public Execute(context: wfjs.ActivityContext): void
        {
            var number1: number = parseFloat(context.Inputs['number1']) || 0;
            var number2: number = parseFloat(context.Inputs['number2']) || 0;

            context.Outputs['total'] = number1 + number2;
        }
    }
}