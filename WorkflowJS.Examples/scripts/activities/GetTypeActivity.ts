module wfjsExample.Activities
{
    export var GetTypeActivity: wfjs.IFlowchart = {
        $outputs: ['result'],
        activities: 
        {
            'GetUserInput': wfjs.Activity
            ({
                activity: new wfjsExample.Activities.PromptActivity(),
                $inputs:
                {
                    message: '"Enter either a number or a string."'
                },
                $outputs: { 'result': 'input' },
                next: 'SetInputType'
            }),
            'SetInputType': wfjs.Execute
            ({
                execute: function(context: wfjs.ActivityContext, done: (err?: Error) => void)
                {
                    var input = context.Inputs['input'];

                    if (!isNaN(input) && input != null && input.trim() != '')
                    {
                        input = parseFloat(input);
                    }

                    /* this is a fix for typeof null returning object. */
                    var inputType = input == null || input == '' ? 'null' : (typeof input);

                    context.Outputs['inputType'] = inputType;

                    done();
                },
                next: 'Switch:DisplayInputType'
            }),
            'Switch:DisplayInputType': wfjs.Execute
            ({
                execute: function(context: wfjs.ActivityContext, done: (err?: Error) => void)
                {
                    var inputType = context.Inputs['inputType'];

                    switch (inputType)
                    {
                        case 'null':
                        case 'undefined': this.next = 'CreateMessage:NoValue'; break;
                        case 'string':    this.next = 'CreateMessage:String';  break;
                        case 'number':    this.next = 'CreateMessage:Number';  break;
                        default:          this.next = 'CreateMessage:Unknown'; break;
                    }

                    done();
                },
                next: null
            }),
            'CreateMessage:NoValue': wfjs.Assign
            ({
                values: { 'result': '"You did not enter a value!"' }
            }),
            'CreateMessage:String': wfjs.Assign
            ({
                values: { 'result': '"You entered a string!"' }
            }),
            'CreateMessage:Number': wfjs.Assign
            ({
                values: { 'result': '"You entered a number!"' }
            }),
            'CreateMessage:Unknown': wfjs.Assign
            ({
                values: { 'result': '"You entered something unknown!"' }
            })
        },
    };
} 