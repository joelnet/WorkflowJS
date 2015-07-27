var wfjsExample;
(function (wfjsExample) {
    var Inputs;
    (function (Inputs) {
        var Application = (function () {
            function Application(button, result) {
                var _this = this;
                this.button = button;
                this.result = result;
                this.button.click(function () { return _this.Click(); });
            }
            Application.prototype.Click = function () {
                var _this = this;
                wfjs.WorkflowInvoker.CreateActivity(wfjsExample.Activities.GetTypeActivity).Extensions({
                    window: window
                }).Invoke(function (err, ctx) {
                    if (err != null) {
                        _this.result.text('Finished with error: ' + err);
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
    })(Inputs = wfjsExample.Inputs || (wfjsExample.Inputs = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=switch.js.map