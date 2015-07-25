var wfjsExample;
(function (wfjsExample) {
    var Extensions;
    (function (Extensions) {
        var Application = (function () {
            function Application(number, button, result) {
                var _this = this;
                this.number = number;
                this.button = button;
                this.result = result;
                this.button.click(function () { return _this.Click(); });
            }
            Application.prototype.Click = function () {
                var _this = this;
                var activity = new wfjsExample.Activities.GetCustomerActivity();
                var extensions = {
                    'CustomerService': new wfjsExample.Services.MockCustomerService()
                };
                var inputs = {
                    'customerId': this.number.val(),
                };
                wfjs.WorkflowInvoker.CreateActivity(activity).Extensions(extensions).Inputs(inputs).Invoke(function (err, ctx) {
                    if (err != null) {
                        _this.result.text(err.toString());
                    }
                    else {
                        _this.result.text(JSON.stringify(ctx.Outputs['customer'], null, '    '));
                    }
                });
            };
            return Application;
        })();
        $(function () {
            var app = new Application($('#number'), $('#button'), $('#result'));
            hljs.initHighlightingOnLoad();
        });
    })(Extensions = wfjsExample.Extensions || (wfjsExample.Extensions = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=extensions.js.map