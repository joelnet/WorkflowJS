var wfjs;
(function (wfjs) {
    wfjs.Assign = function (options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new AssignActivity(options.values),
            next: options.next
        });
    };
    /**
     * AssignActivity Assigns values to Outputs.
     */
    var AssignActivity = (function () {
        function AssignActivity(values) {
            this.$inputs = ['*'];
            this.$outputs = ['*'];
            this._values = values || {};
        }
        AssignActivity.prototype.Execute = function (context, done) {
            for (var key in this._values) {
                context.Outputs[key] = wfjs.EvalHelper.Eval(context.Inputs, this._values[key]);
            }
            done();
        };
        return AssignActivity;
    })();
    wfjs.AssignActivity = AssignActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=AssignActivity.js.map