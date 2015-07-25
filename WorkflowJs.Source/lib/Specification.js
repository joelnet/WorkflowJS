var wfjs;
(function (wfjs) {
    var Specification = (function () {
        function Specification(criteria) {
            this._criteria = criteria;
        }
        Specification.prototype.IsSatisfiedBy = function (value) {
            return this._criteria(value);
        };
        return Specification;
    })();
    wfjs.Specification = Specification;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Specification.js.map