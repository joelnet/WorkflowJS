var wfjsExample;
(function (wfjsExample) {
    var BasicWorkflow;
    (function (BasicWorkflow) {
        var Application = (function () {
            function Application(button, result) {
                var _this = this;
                this.button = button;
                this.result = result;
                button.click(function () { return _this.Click(); });
            }
            Application.prototype.Click = function () {
                var _this = this;
                wfjs.WorkflowInvoker.CreateActivity(wfjsExample.Activities.GreetUserActivity).Extensions({
                    window: window
                }).Invoke(function (err, ctx) {
                    if (err != null) {
                        _this.result.text('finished with error: ' + err.toString());
                    }
                    else {
                        _this.result.text(ctx.Outputs['result']);
                    }
                });
            };
            return Application;
        })();
        $(function () {
            var app = new Application($('#button'), $('#result'));
            hljs.initHighlightingOnLoad();
        });
    })(BasicWorkflow = wfjsExample.BasicWorkflow || (wfjsExample.BasicWorkflow = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=decision.js.map