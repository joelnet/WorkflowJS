var wfjs;
(function (wfjs) {
    var Activities;
    (function (Activities) {
        var AddActivity = (function () {
            function AddActivity() {
                this.$inputs = ['number1', 'number2'];
                this.$outputs = ['total'];
            }
            AddActivity.prototype.Execute = function (context, done) {
                var number1 = context.Inputs['number1'];
                var number2 = context.Inputs['number2'];
                context.Outputs['total'] = number1 + number2;
                done();
            };
            return AddActivity;
        })();
        Activities.AddActivity = AddActivity;
    })(Activities = wfjs.Activities || (wfjs.Activities = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=AddActivity.js.map