var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        Activities.GetMathProblemWorkflow = function () {
            return wfjs.Flowchart({
                $outputs: ['correct'],
                activities: {
                    'CreateAccount': wfjs.Activity({
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
        };
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=MathProblemWorkflow.js.map