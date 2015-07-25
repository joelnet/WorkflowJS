module wfjsExample.Activities
{
    export var GetMathProblemWorkflow = () =>
    {
        return <wfjs.IFlowchartMap>
        {
            $outputs: ['correct'],

            activities:
            {
                'CreateAccount': wfjs.Activity({
                    activity: new CreateMathActivity(),
                    $outputs: {
                        'problem': 'problem',
                        'solution': 'solution'
                    },
                    next: 'WaitForAnswer'
                }),
                'WaitForAnswer': wfjs.Pause({
                    next: 'ValidateAnswer'
                }),
                'ValidateAnswer': wfjs.Assign({
                    values:
                    {
                        'correct': 'this.solution == this.answer'
                    }
                })
            }
        };
    }
}