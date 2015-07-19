﻿module wfjs.Activities
{
    export var GreetUserActivity: wfjs.IFlowchartMap = {
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
} 