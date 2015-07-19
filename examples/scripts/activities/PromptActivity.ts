module wfjs.Activities
{
    export class PromptActivity implements wfjs.Activity
    {
        public $inputs = ['message'];
        public $outputs = ['result'];

        public Execute(context: wfjs.ActivityContext, done: (err?: Error) => void): void
        {
            /* window is passed in as an extension */
            var window: Window = context.Extensions['window'];

            if (window == null)
            {
                throw new Error('Extension window cannot be null.');
            }

            var response = window.prompt(context.Inputs['message']);

            context.Outputs['result'] = response;

            done();
        }
    }
}