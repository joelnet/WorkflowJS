# WorkflowJS

WorkflowsJS, built for complex JavaScript applications.

WorkflowJS was inspired by Windows Workflow Foundation (WF) in .NET 4. WorkflowJS allows you
to chain smaller Activities together into a larger Workflow.

## Building your first Activity

TypeScript example:

    /*
     * AddActivity Adds inputs number1 and number2 and sets output total.
     */
    export class AddActivity implements wfjs.IActivity
    {
        public $inputs = ['number1', 'number2'];
        public $outputs = ['total'];

        public Execute(context: wfjs.ActivityContext): void
        {
            var number1: number = parseFloat(context.Inputs['number1']) || 0;
            var number2: number = parseFloat(context.Inputs['number2']) || 0;

            context.Outputs['total'] = number1 + number2;
        }
    }

JavaScript example:

    /*
     * AddActivity Adds inputs number1 and number2 and sets output total.
     */
    function AddActivity() {
        this.$inputs = ['number1', 'number2'];
        this.$outputs = ['total'];
    }

    AddActivity.prototype.Execute = function (context) {
        var number1 = parseFloat(context.Inputs['number1']) || 0;
        var number2 = parseFloat(context.Inputs['number2']) || 0;

        context.Outputs['total'] = number1 + number2;
    };

## Building your first Workflow