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

This workflow takes two numbers, adds them together and then multiplies the
result by two.

    var workflow = wfjs.Flowchart
    ({
        $inputs: ['number1', 'number2'],
        $outputs: ['total'],
        activities:
        {

            // Add number1 and number2
            'AddNumbers': wfjs.Activity
            ({
                activity: new AddActivity(),
                $inputs:
                {
                    'number1': 'this.number1',
                    'number2': 'this.number2'
                }
                $outputs:
                {
                    'total': 'total'
                },
                next: 'MultiplyByTwo'
            }),

            // Multiply the total by 2
            'MultiplyByTwo': wfjs.Assign
            ({
                values:
                {
                    'total': 'this.total * 2'
                }
            })
        }
    });

    var inputs =
    {
        'number1': 123,
        'number2': 456,
    };

    // Invoke the workflow
    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Inputs(inputs)
        .Invoke((err, ctx) =>
        {
            if (err != null)
            {
                console.log('Finished with error: ' + err.toString());
            }
            else
            {
                console.log('Total: ' + ctx.Outputs['total']);
            }
        });

## Setting the Input values

The values are dynamically evaulated upon runtime. So it is possible to make
dynamic variable assignments.

    $inputs:
    {
        'fullName': 'this.firstName = " " + this.lastName'
    }

Also note, if you want to assign a static string you must use quotes
inside the string. Numbers do not require quotes.

    $inputs:
    {
        'fullName': '"Keyser Soze"'
        'age': 38
    }

## Pausing and Resuming the Workflow


This is an example of a flowcharts activities that uses Pause.

    activities:
    {

        // Create a random math problem
        'CreateMathProblem': wfjs.Activity
        ({
            activity: new CreateMathActivity(),
            $outputs: {
                'problem': 'problem',
                'solution': 'solution'
            },
            next: 'WaitForAnswer'
        }),

        // Pause the workflow
        'WaitForAnswer': wfjs.Pause
        ({
            next: 'ValidateAnswer'
        }),

        // Resume and validate the answer
        'ValidateAnswer': wfjs.Assign
        ({
            values:
            {
                'correct': 'this.solution == this.answer'
            }
        })
    }

