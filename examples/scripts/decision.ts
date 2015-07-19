declare var hljs;

module wfjsExample.BasicWorkflow
{
    class Application
    {
        constructor(private button: JQuery, private result: JQuery)
        {
            button.click(() => this.Click());
        }
        
        public Click()
        {
            wfjs.WorkflowInvoker
                .CreateActivity(wfjs.Activities.GreetUserActivity)
                .Extensions({
                    window: window
                })
                .Invoke((err, ctx) =>
                {
                    if (err != null)
                    {
                        this.result.text('finished with error: ' + err.toString());
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