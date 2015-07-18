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
            var flowchart: wfjs.IFlowchartMap = {
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
                        next: 'Decision:IsCancelled'
                    },
                    'Decision:IsCancelled':
                    {
                        condition: 'this.name == null || this.name == ""',
                        ontrue: 'CreateMessage:NameRefusal',
                        onfalse: 'CreateMessage:Hello'
                    },
                    'CreateMessage:NameRefusal':
                    {
                        output: 'result',
                        value: '"You did not enter a name!"',
                    },
                    'CreateMessage:Hello':
                    {
                        output: 'result',
                        value: '"Hello " + this.name + "!"',
                    }
                }
            };

            wfjs.WorkflowInvoker
                .CreateActivity(flowchart)
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