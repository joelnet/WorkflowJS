var wfjs;
(function (wfjs) {
    /**
     * ThreadHelper Helper methods for dealing with Multi-Threading.
     */
    var ThreadHelper = (function () {
        function ThreadHelper() {
        }
        /**
         * NewThread Creates a new Thread to execute the command
         */
        ThreadHelper.NewThread = function (fn) {
            setTimeout(function () { return fn(); }, 0);
        };
        return ThreadHelper;
    })();
    wfjs.ThreadHelper = ThreadHelper;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=ThreadHelper.js.map