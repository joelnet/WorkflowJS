var wfjs;
(function (wfjs) {
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
    })(Activities = wfjs.Activities || (wfjs.Activities = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=HelloWorldActivity.js.map