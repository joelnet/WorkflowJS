module wfjsExample.Activities
{
    export class PromptActivity implements wfjs.IActivity
    {
        public $inputs = ['message'];
        public $outputs = ['result'];

        public Execute(context: wfjs.ActivityContext): void
        {
            /* window is passed in as an extension */
            var window: Window = context.Extensions['window'];

            if (window == null)
            {
                throw new Error('Extension window cannot be null.');
            }

            var response = window.prompt(context.Inputs['message']);

            context.Outputs['result'] = response;
        }
    }
}