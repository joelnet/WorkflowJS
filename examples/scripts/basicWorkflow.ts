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
            var inputs: wfjs.Dictionary<any> = {
                'number': 123
            };

            this.AppendToElement(this.element, 'Actions: [AddActivity]');
            this.AppendToElement(this.element, 'Inputs: ' + JSON.stringify(inputs));

            var workflow: wfjs.IWorkflowMap = {
                $inputs: ['number'],
                $outputs: ['total'],
                activities: 
                {
                    "Add 100":
                    {
                        activity: new wfjs.Activities.AddActivity(),
                        $inputs:
                        {
                            'number1': { name: 'number' },
                            'number2': { value: 100 }
                        },
                        $outputs: { 'total': 'total' },
                        next: "Multiply 2"
                    },
                    "Multiply 2":
                    {
                        activity: new wfjs.Activities.MultiplyActivity(),
                        $inputs:
                        {
                            'number1': { name: 'total' },
                            'number2': { value: 2 }
                        },
                        $outputs: { 'total': 'total' },
                        next: null
                    }
                }
            };

            wfjs.WorkflowInvoker
                .CreateActivity(workflow)
                .Inputs(inputs)
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