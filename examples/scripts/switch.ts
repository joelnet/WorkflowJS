declare var hljs;

module wfjsExample.Inputs
{
    class Application
    {
        constructor(private button: JQuery, private result: JQuery)
        {
            this.button.click(() => this.Click());
        }
        
        public Click()
        {
            wfjs.WorkflowInvoker
                .CreateActivity(wfjsExample.Activities.GetTypeActivity)
                .Extensions({
                    window: window
                })
                .Invoke((err, ctx) =>
                {
                    if (err != null)
                    {
                        this.result.text('Finished with error: ' + err.toString());
                    }
                    else
                    {
                        this.result.text(ctx.Outputs['result']);
                    }
                });
        }
    }

    $(() =>
    {
        var app = new Application($('#button'), $('#result'));
        hljs.initHighlightingOnLoad();
    });
}