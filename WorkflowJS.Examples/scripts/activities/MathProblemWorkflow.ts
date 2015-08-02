module wfjsExample.Activities
{
    export function GetMathProblemWorkflow()
    {
        return wfjs.Flowchart
        ({
            $outputs: ['correct', 'problem', 'solution'],

            activities:
            {
                'CreateMathProblem': wfjs.Activity
                ({
                    activity: new CreateMathActivity(),
                    $outputs: {
                        'problem': 'problem',
                        'solution': 'solution'
                    },
                    next: 'WaitForAnswer'
                }),
                'WaitForAnswer': wfjs.Pause
                ({
                    next: 'ValidateAnswer'
                }),
                'ValidateAnswer': wfjs.Assign
                ({
                    values:
                    {
                        'correct': 'this.solution == this.answer'
                    }
                })
            }
        });
    }
}