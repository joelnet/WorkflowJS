var wfjs;
(function (wfjs) {
    var Specifications = (function () {
        function Specifications() {
        }
        Specifications._IsPaused = new wfjs.Specification(function (o) { return o.State != null; });
        return Specifications;
    })();
    wfjs.Specifications = Specifications;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Specifications.js.map