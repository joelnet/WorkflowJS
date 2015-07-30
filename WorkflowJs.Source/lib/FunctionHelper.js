var wfjs;
(function (wfjs) {
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var _FunctionHelper = (function () {
        function _FunctionHelper() {
        }
        _FunctionHelper.ParameterCount = function (fn) {
            return _FunctionHelper.FormalParameterList(fn).length;
        };
        /**
         * FormalParameterList returns a string array of parameter names
         */
        _FunctionHelper.FormalParameterList = function (fn) {
            // code from: http://stackoverflow.com/questions/6921588/is-it-possible-to-reflect-the-arguments-of-a-javascript-function
            var fnText, argDecl;
            var args = [];
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            var r = argDecl[1].split(FN_ARG_SPLIT);
            for (var a in r) {
                var arg = r[a];
                arg.replace(FN_ARG, function (all, underscore, name) {
                    args.push(name);
                });
            }
            return args;
        };
        return _FunctionHelper;
    })();
    wfjs._FunctionHelper = _FunctionHelper;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=FunctionHelper.js.map