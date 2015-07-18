/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />

module wfjsExample.Inputs
{
    class Application
    {
        constructor(
            private number1: JQuery,
            private number2: JQuery,
            private button: JQuery,
            private result: JQuery)
        {
            this.button.click(() => this.Click());
        }
        
        public Click()
        {
            var activity = new wfjs.Activities.AddActivity();
            var inputs: wfjs.Dictionary<any> = {
                'number1': parseFloat(this.number1.val()) || 0,
                'number2': parseFloat(this.number2.val()) || 0
            };

            wfjs.WorkflowInvoker
                .CreateActivity(activity)
                .Inputs(inputs)
                .Invoke((err, ctx) =>
                {
                    if (err != null)
                    {
                        this.result.text('Finished with error: ' + err.toString());
                    }
                    else
                    {
                        this.result.text(ctx.Outputs['total']);
                    }
                });
        }
    }

    window.onload = () =>
    {
        var app = new Application($('#number1'), $('#number2'), $('#button'), $('#result'));
    };
}