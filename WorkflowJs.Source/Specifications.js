var wfjs;
(function (wfjs) {
    var _Specifications = (function () {
        function _Specifications() {
        }
        _Specifications.IsPaused = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 'State') == 3 /* Paused */ || wfjs.ObjectHelper.GetValue(o, 'StateData') != null; });
        _Specifications.IsWildcardDictionary = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, '*') != null; });
        _Specifications.IsWildcardArray = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 0) == '*'; });
        _Specifications.Has$next = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 'Outputs', '$next') != null; });
        _Specifications.IsWorkflowActivity = new wfjs.Specification(function (o) { return wfjs.ObjectHelper.GetValue(o, 'activity') != null; });
        _Specifications.IsExecutableActivity = new wfjs.Specification(function (o) { return typeof wfjs.ObjectHelper.GetValue(o, 'Execute') == 'function'; });
        return _Specifications;
    })();
    wfjs._Specifications = _Specifications;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Specifications.js.map