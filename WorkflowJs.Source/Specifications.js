var wfjs;
(function (wfjs) {
    var _Specifications = (function () {
        function _Specifications() {
        }
        _Specifications.IsPaused = new wfjs.Specification(function (o) { return o.StateData != null; });
        _Specifications.IsWildcardDictionary = new wfjs.Specification(function (o) { return o != null && o['*'] != null; });
        _Specifications.IsWildcardArray = new wfjs.Specification(function (o) { return o != null && o.length == 1 && o[0] == '*'; });
        return _Specifications;
    })();
    wfjs._Specifications = _Specifications;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Specifications.js.map