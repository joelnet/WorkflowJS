var wfjs;
(function (wfjs) {
    function Execute(options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new ExecuteActivity(options),
            next: options.next
        });
    }
    wfjs.Execute = Execute;
    ;
    /**
     * AssignActivity Assigns values to Outputs.
     */
    var ExecuteActivity = (function () {
        function ExecuteActivity(options) {
            this.$inputs = ['*'];
            this.$outputs = ['*'];
            this._options = options || {};
        }
        ExecuteActivity.prototype.Execute = function (context, done) {
            this._options.execute(context, done);
        };
        return ExecuteActivity;
    })();
    wfjs.ExecuteActivity = ExecuteActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=ExecuteActivity.js.map