module wfjs.Activities
{
    export class HelloWorldActivity implements wfjs.Activity
    {
        public $outputs = ['response'];

        public Execute(context: wfjs.ActivityContext, done: (err?: Error) => void): void
        {
            context.Outputs['response'] = 'Hello World!'

            done();
        }
    }
}