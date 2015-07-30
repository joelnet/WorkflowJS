var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        function GetTypeActivity() {
            return wfjs.Flowchart({
                $outputs: ['result'],
                activities: {
                    'GetUserInput': wfjs.Activity({
                        activity: new wfjsExample.Activities.PromptActivity(),
                        $inputs: {
                            message: '"Enter either a number or a string."'
                        },
                        $outputs: { 'result': 'input' },
                        next: 'SetInputType'
                    }),
                    'SetInputType': wfjs.Execute({
                        execute: function (context, done) {
                            var input = context.Inputs['input'];
                            if (!isNaN(input) && input != null && input.trim() != '') {
                                input = parseFloat(input);
                            }
                            /* this is a fix for typeof null returning object. */
                            var inputType = input == null || input == '' ? 'null' : (typeof input);
                            context.Outputs['inputType'] = inputType;
                            done();
                        },
                        next: 'Switch:DisplayInputType'
                    }),
                    'Switch:DisplayInputType': wfjs.Execute({
                        execute: function (context, done) {
                            var inputType = context.Inputs['inputType'];
                            switch (inputType) {
                                case 'null':
                                case 'undefined':
                                    context.Outputs['$next'] = 'CreateMessage:NoValue';
                                    break;
                                case 'string':
                                    context.Outputs['$next'] = 'CreateMessage:String';
                                    break;
                                case 'number':
                                    context.Outputs['$next'] = 'CreateMessage:Number';
                                    break;
                                default:
                                    context.Outputs['$next'] = 'CreateMessage:Unknown';
                                    break;
                            }
                            done();
                        },
                        next: null
                    }),
                    'CreateMessage:NoValue': wfjs.Assign({
                        values: { 'result': '"You did not enter a value!"' }
                    }),
                    'CreateMessage:String': wfjs.Assign({
                        values: { 'result': '"You entered a string!"' }
                    }),
                    'CreateMessage:Number': wfjs.Assign({
                        values: { 'result': '"You entered a number!"' }
                    }),
                    'CreateMessage:Unknown': wfjs.Assign({
                        values: { 'result': '"You entered something unknown!"' }
                    })
                },
            });
        }
        Activities.GetTypeActivity = GetTypeActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=GetTypeActivity.js.map