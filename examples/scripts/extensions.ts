declare var hljs;

module wfjsExample.Extensions
{
    class Application
    {
        constructor(
            private number: JQuery,
            private button: JQuery,
            private result: JQuery)
        {
            this.button.click(() => this.Click());
        }
        
        public Click()
        {
            var activity = new wfjs.Activities.GetCustomerActivity();
            var extensions: wfjs.Dictionary<any> = {
                'CustomerService': new wfjs.Services.MockCustomerService()
            };
            var inputs: wfjs.Dictionary<any> = {
                'customerId': this.number.val(),
            };

            wfjs.WorkflowInvoker
                .CreateActivity(activity)
                .Extensions(extensions)
                .Inputs(inputs)
                .Invoke((err, ctx) =>
                {
                    if (err != null)
                    {
                        this.result.text(err.toString());
                    }
                    else
                    {
                        this.result.text(JSON.stringify(ctx.Outputs['customer'], null, '    '));
                    }
                });
        }
    }

    $(() =>
    {
        var app = new Application($('#number'), $('#button'), $('#result'));
        hljs.initHighlightingOnLoad();
    });
}