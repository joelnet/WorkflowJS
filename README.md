# WorkflowJS

WorkflowsJS, built for complex JavaScript applications.

WorkflowJS was inspired by Windows Workflow Foundation (WF) in .NET 4. WorkflowJS allows you
to chain smaller Activities together into a larger Workflow.

## Building your first Activity

### TypeScript example:

    /*
     * AddActivity Adds inputs number1 and number2 and sets output total.
     */
    class AddActivity implements wfjs.IActivity
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

### JavaScript example:

    /*
     * AddActivity Adds inputs number1 and number2 and sets output total.
     */
    function AddActivity()
    {
        this.$inputs = ['number1', 'number2'];
        this.$outputs = ['total'];
    }

    AddActivity.prototype.Execute = function (context)
    {
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

    // Invoke the workflow
    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Inputs(
        {
            'number1': 123,
            'number2': 456,
        })
        .Invoke((err, ctx) =>
        {
            console.log('Total: ' + ctx.Outputs['total']);
        });

## Setting the Input values

Values are evaulated upon runtime making it is possible to make dynamic variable assignments.

Also note, if you want to assign a static string you must use quotes
inside the string. Numbers do not require quotes.

    $inputs:
    {
        'fullName': 'this.firstName = " " + this.lastName',
        'userType': '"web user"'
        'age': 38
    }


## Pausing and Resuming the Workflow

This is an example of a flowcharts activities that uses Pause.

    var workflow = wfjs.Flowchart
    ({
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
    });

Invoke the workflow and save the StateData

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke((err, ctx) =>
        {
            if (ctx.State == wfjs.WorkflowState.Paused)
            {
                // save the StateData somewhere
                var stateData = ctx.StateData;
            }
        });

Resume the workflow by setting the State of the workflow.

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs(
        {
            'answer': 42
        })
        .State(stateData)
        .Invoke((err, ctx) =>
        {
            var correct = ctx.Outputs['correct'];
        });

## Workflow Activity Types

### wfjs.Activity

The wfjs.Activity is a basic Workflow Activity

input     description
--------  -----------
activity  activity of type IActivity to execute
$inputs   (optional) activity input mapping
$outputs  (optional) activity output mapping
next      (optional) next activity to execute


    wfjs.Activity(
    {
        activity: IActivity;
        $inputs?: Dictionary<any>;
        $outputs?: Dictionary<string>;
        next?: string;
    })

### wfjs.Assign

The wfjs.Assign activity is a simple assignment activity.

input     description
--------  -----------------------------------
values    dictionary of values to set.
next      (optional) next activity to execute

    wfjs.Assign(
    {
        values: Dictionary<any>;
        next?: string;
    })

### wfjs.Decision

The wfjs.Decision tests a condition and goes next to either the true value or false value.

input      description
--------   ----------------------------------------------
condition  condition to evaluate to true or false
true       next activity to execute if condition is true
false      next activity to execute if condition is false

    wfjs.Decision(
    {
        condition: string;
        true: string;
        false: string;
    })

### wfjs.Execute

The wfjs.Execute activity is a quick way to execute a code snippet.

input    description
-------  -----------------------------------
execute  code to execute
next     (optional) next activity to execute

    wfjs.Execute(
    {
        execute: (context: ActivityContext, done?: (err?: Error) => void) => void;
        next?: string;
    })

### wfjs.Flowchart

The wfjs.Flowchart activity is what you use to tie it all together.

input       description
-------     -----------------------------------
$inputs     (optional) activity input mapping
$outputs    (optional) activity output mapping
activities  Collection of activities to execute

    wfjs.Flowchart(
    {
        $inputs?: string[];
        $output?: string[];
        activities: wfjs.Dictionary<IActivityBase>;
    })
