module wfjsExample.Activities
{
    export class HelloWorldActivity implements wfjs.IActivity
    {
        public $outputs = ['response'];

        public Execute(context: wfjs.ActivityContext): void
        {
            context.Outputs['response'] = 'Hello World!'
        }
    }
}