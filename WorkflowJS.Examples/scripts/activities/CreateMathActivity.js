var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        var CreateMathActivity = (function () {
            function CreateMathActivity() {
                this.$outputs = ['problem', 'solution'];
            }
            CreateMathActivity.prototype.Execute = function (context, done) {
                var number1 = Math.floor((Math.random() * 10) + 1);
                var number2 = Math.floor((Math.random() * 10) + 1);
                context.Outputs['problem'] = number1 + ' + ' + number2;
                context.Outputs['solution'] = number1 + number2;
                done();
            };
            return CreateMathActivity;
        })();
        Activities.CreateMathActivity = CreateMathActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=CreateMathActivity.js.map