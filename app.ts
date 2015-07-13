class MyActivity implements wfjs.Activity
{
    public $inputs = ['name'];
    public $outputs = ['output'];

    public Execute(context: wfjs.ActivityContext, done: (err: Error) => void): void
    {
        var c = context.Extensions['console'];
        var name = context.Inputs['name'];

        var output = 'MyActivity.Execute: ' + name;

        context.Outputs['output'] = output;

        c.log('Execute');

        done(null);
    }
}

class Greeter
{
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement)
    {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start()
    {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);

        var activity = new MyActivity();
        var workflowApplication = new wfjs.WorkflowApplication(activity);
        workflowApplication.Extensions['console'] = console;
        workflowApplication.Inputs['name'] = 'Joel';
        workflowApplication.Run((err, context) =>
        {
            if (err != null)
            {
                console.log('finished with error: ', err);
            }
            else
            {
                console.log('result: ', context.Outputs['output']);
            }

            console.log('done.');
        });
    }

    stop()
    {
        clearTimeout(this.timerToken);
    }
}

window.onload = () =>
{
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};