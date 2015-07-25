declare var hljs;

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
            var activity = new wfjsExample.Activities.AddActivity();
            var inputs: wfjs.Dictionary<any> = {
                'number1': this.number1.val(),
                'number2': this.number2.val()
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

    $(() =>
    {
        var app = new Application($('#number1'), $('#number2'), $('#button'), $('#result'));
        hljs.initHighlightingOnLoad();
    });
}