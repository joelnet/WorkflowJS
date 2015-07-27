module wfjsExample.Activities
{
    export var GreetUserActivity: wfjs.IFlowchart = {
        $outputs: ['result'],
        activities: 
        {
            'GetUsersName': wfjs.Activity
            ({
                activity: new wfjsExample.Activities.PromptActivity(),
                $inputs:
                {
                    message: '"What is your name?"'
                },
                $outputs: { 'result': 'name' },
                next: 'Decision:IsCancelled'
            }),
            'Decision:IsCancelled': wfjs.Decision
            ({
                condition: 'this.name == null || this.name == ""',
                true: 'CreateMessage:NameRefusal',
                false: 'CreateMessage:Hello'
            }),
            'CreateMessage:NameRefusal': wfjs.Assign
            ({
                values:
                {
                    result: '"You did not enter a name!"'
                }
            }),
            'CreateMessage:Hello': wfjs.Assign
            ({
                values:
                {
                    result: '"Hello " + this.name + "!"'
                }
            })
        }
    };
} 