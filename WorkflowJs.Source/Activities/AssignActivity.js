var wfjs;
(function (wfjs) {
    function Assign(options) {
        options = options || {};
        return wfjs.Execute({
            execute: function (context) {
                for (var key in (options.values || {})) {
                    context.Outputs[key] = wfjs._EvalHelper.Eval(context.Inputs, options.values[key]);
                }
            },
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
    }
    wfjs.Assign = Assign;
    ;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=AssignActivity.js.map