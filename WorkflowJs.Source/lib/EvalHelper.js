var wfjs;
(function (wfjs) {
    var _EvalHelper = (function () {
        function _EvalHelper() {
        }
        _EvalHelper.Eval = function (thisArg, code) {
            var contextEval = function () {
                return eval(code);
            };
            return contextEval.call(thisArg);
        };
        return _EvalHelper;
    })();
    wfjs._EvalHelper = _EvalHelper;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=EvalHelper.js.map