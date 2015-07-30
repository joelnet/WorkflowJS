var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        function GreetUserActivity() {
            return wfjs.Flowchart({
                $outputs: ['result'],
                activities: {
                    'GetUsersName': wfjs.Activity({
                        activity: new wfjsExample.Activities.PromptActivity(),
                        $inputs: {
                            message: '"What is your name?"'
                        },
                        $outputs: { 'result': 'name' },
                        next: 'Decision:IsCancelled'
                    }),
                    'Decision:IsCancelled': wfjs.Decision({
                        condition: 'this.name == null || this.name == ""',
                        true: 'CreateMessage:NameRefusal',
                        false: 'CreateMessage:Hello'
                    }),
                    'CreateMessage:NameRefusal': wfjs.Assign({
                        values: {
                            result: '"You did not enter a name!"'
                        }
                    }),
                    'CreateMessage:Hello': wfjs.Assign({
                        values: {
                            result: '"Hello " + this.name + "!"'
                        }
                    })
                }
            });
        }
        Activities.GreetUserActivity = GreetUserActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=GreetUserActivity.js.map