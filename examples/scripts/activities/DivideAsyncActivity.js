var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        var DivideAsyncActivity = (function () {
            function DivideAsyncActivity() {
                this.$inputs = ['number1', 'number2'];
                this.$outputs = ['total'];
            }
            DivideAsyncActivity.prototype.Execute = function (context, done) {
                var number1 = parseFloat(context.Inputs['number1']) || 0;
                var number2 = parseFloat(context.Inputs['number2']) || 0;
                this._DivideAsync(number1, number2, function (err, total) {
                    context.Outputs['total'] = total;
                    done(err);
                });
            };
            DivideAsyncActivity.prototype._DivideAsync = function (number1, number2, callback) {
                setTimeout(function () {
                    if (number2 == 0) {
                        return callback(new Error('Cannot divide by 0.'));
                    }
                    callback(null, number1 / number2);
                }, 0);
            };
            return DivideAsyncActivity;
        })();
        Activities.DivideAsyncActivity = DivideAsyncActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=DivideAsyncActivity.js.map