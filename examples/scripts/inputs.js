/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
var wfjsExample;
(function (wfjsExample) {
    var Inputs;
    (function (Inputs) {
        var Application = (function () {
            function Application(number1, number2, button, result) {
                var _this = this;
                this.number1 = number1;
                this.number2 = number2;
                this.button = button;
                this.result = result;
                this.button.click(function () { return _this.Click(); });
            }
            Application.prototype.Click = function () {
                var _this = this;
                var activity = new wfjs.Activities.AddActivity();
                var inputs = {
                    'number1': this.number1.val(),
                    'number2': this.number2.val()
                };
                wfjs.WorkflowInvoker.CreateActivity(activity).Inputs(inputs).Invoke(function (err, ctx) {
                    if (err != null) {
                        _this.result.text('Finished with error: ' + err.toString());
                    }
                    else {
                        _this.result.text(ctx.Outputs['total']);
                    }
                });
            };
            return Application;
        })();
        $(function () {
            var app = new Application($('#number1'), $('#number2'), $('#button'), $('#result'));
            hljs.initHighlightingOnLoad();
        });
    })(Inputs = wfjsExample.Inputs || (wfjsExample.Inputs = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=inputs.js.map