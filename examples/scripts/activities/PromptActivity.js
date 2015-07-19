var wfjs;
(function (wfjs) {
    var Activities;
    (function (Activities) {
        var PromptActivity = (function () {
            function PromptActivity() {
                this.$inputs = ['message'];
                this.$outputs = ['result'];
            }
            PromptActivity.prototype.Execute = function (context, done) {
                /* window is passed in as an extension */
                var window = context.Extensions['window'];
                if (window == null) {
                    throw new Error('Extension window cannot be null.');
                }
                var response = window.prompt(context.Inputs['message']);
                context.Outputs['result'] = response;
                done();
            };
            return PromptActivity;
        })();
        Activities.PromptActivity = PromptActivity;
    })(Activities = wfjs.Activities || (wfjs.Activities = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=PromptActivity.js.map