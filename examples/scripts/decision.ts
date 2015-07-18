module wfjsExample.BasicWorkflow
{
    class Application
    {
        private element: HTMLElement;

        constructor(element: HTMLElement)
        {
            this.element = element;
        }
        
        public Run()
        {
            var workflow: wfjs.IFlowchartMap = {
                $outputs: ['result'],
                activities: 
                {
                    'GetUsersName':
                    {
                        activity: new wfjs.Activities.PromptActivity(),
                        $inputs:
                        {
                            message: { value: 'What is your name?' }
                        },
                        $outputs: { 'result': 'name' },
                        next: 'CreateMessage'
                    },
                    'CreateMessage':
                    {
                        output: 'result',
                        value: '"Hello " + this.name + "!"'
                    }
                }
            };

            wfjs.WorkflowInvoker
                .CreateActivity(workflow)
                .Extensions({
                    "window": window
                })
                .Invoke((err, ctx) =>
                {
                    if (err != null)
                    {
                        this.AppendToElement(this.element, 'finished with error: ' + err.toString());
                    }
                    else
                    {
                        this.AppendToElement(this.element, 'Outputs: ' + JSON.stringify(ctx.Outputs));
                    }
            
                    this.AppendToElement(this.element, 'done.');
                });
        }

        private AppendToElement(element: HTMLElement, text: string): void
        {
            var el = document.createElement('div');
            el.innerText = text;
            element.appendChild(el);
        }
    }

    window.onload = () =>
    {
        var el = document.getElementById('content');
        var app = new Application(el);
        app.Run();
    };
}