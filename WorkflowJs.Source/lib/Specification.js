var wfjs;
(function (wfjs) {
    var _Specification = (function () {
        function _Specification(criteria) {
            this._criteria = criteria;
        }
        _Specification.prototype.IsSatisfiedBy = function (value) {
            return this._criteria(value);
        };
        return _Specification;
    })();
    wfjs._Specification = _Specification;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Specification.js.map