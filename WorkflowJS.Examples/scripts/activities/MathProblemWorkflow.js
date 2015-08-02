var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        function GetMathProblemWorkflow() {
            return wfjs.Flowchart({
                $outputs: ['correct', 'problem', 'solution'],
                activities: {
                    'CreateMathProblem': wfjs.Activity({
                        activity: new Activities.CreateMathActivity(),
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
                        values: {
                            'correct': 'this.solution == this.answer'
                        }
                    })
                }
            });
        }
        Activities.GetMathProblemWorkflow = GetMathProblemWorkflow;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=MathProblemWorkflow.js.map