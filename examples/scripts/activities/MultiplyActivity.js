var wfjs;
(function (wfjs) {
    var Activities;
    (function (Activities) {
        var MultiplyActivity = (function () {
            function MultiplyActivity() {
                this.$inputs = ['number1', 'number2'];
                this.$outputs = ['total'];
            }
            MultiplyActivity.prototype.Execute = function (context, done) {
                var number1 = parseFloat(context.Inputs['number1']) || 0;
                var number2 = parseFloat(context.Inputs['number2']) || 0;
                context.Outputs['total'] = number1 * number2;
                done();
            };
            return MultiplyActivity;
        })();
        Activities.MultiplyActivity = MultiplyActivity;
    })(Activities = wfjs.Activities || (wfjs.Activities = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=MultiplyActivity.js.map