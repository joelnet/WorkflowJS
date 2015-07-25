var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        var HelloWorldActivity = (function () {
            function HelloWorldActivity() {
                this.$outputs = ['response'];
            }
            HelloWorldActivity.prototype.Execute = function (context, done) {
                context.Outputs['response'] = 'Hello World!';
                done();
            };
            return HelloWorldActivity;
        })();
        Activities.HelloWorldActivity = HelloWorldActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=HelloWorldActivity.js.map