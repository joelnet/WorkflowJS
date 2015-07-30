var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        var PromptActivity = (function () {
            function PromptActivity() {
                this.$inputs = ['message'];
                this.$outputs = ['result'];
            }
            PromptActivity.prototype.Execute = function (context) {
                /* window is passed in as an extension */
                var window = context.Extensions['window'];
                if (window == null) {
                    throw new Error('Extension window cannot be null.');
                }
                var response = window.prompt(context.Inputs['message']);
                context.Outputs['result'] = response;
            };
            return PromptActivity;
        })();
        Activities.PromptActivity = PromptActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=PromptActivity.js.map