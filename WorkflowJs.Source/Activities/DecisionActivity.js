var wfjs;
(function (wfjs) {
    function Decision(options) {
        options = options || {};
        return wfjs.Execute({
            execute: function (context) {
                var result = wfjs._EvalHelper.Eval(context.Inputs, options.condition);
                context.Outputs['$next'] = result ? options.true : options.false;
            },
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
    }
    wfjs.Decision = Decision;
    ;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=DecisionActivity.js.map