var wfjs;
(function (wfjs) {
    wfjs.Decision = function (options) {
        options = options || {};
        return {
            $inputs: { '*': '*' },
            $outputs: { '$next': '$next' },
            activity: new DecisionActivity(options),
            next: options.next
        };
    };
    /**
     * AssignActivity Assigns values to Outputs.
     */
    var DecisionActivity = (function () {
        function DecisionActivity(options) {
            this.$inputs = ['*'];
            this.$outputs = ['$next'];
            this._options = options || {};
        }
        DecisionActivity.prototype.Execute = function (context, done) {
            // TODO: test if we can use just Inputs or if we have to use Inputs AND Outputs
            var values = wfjs.ObjectHelper.CombineObjects(context.Inputs, context.Outputs);
            var result = wfjs.EvalHelper.Eval(values, this._options.condition);
            context.Outputs['$next'] = result ? this._options.true : this._options.false;
            done();
        };
        return DecisionActivity;
    })();
    wfjs.DecisionActivity = DecisionActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=DecisionActivity.js.map