var wfjs;
(function (wfjs) {
    wfjs.Pause = function (options) {
        return new PauseActivity(options);
    };
    var PauseActivity = (function () {
        function PauseActivity(options) {
            this._type = 'pause';
            if (options != null) {
                this.next = options.next;
            }
        }
        PauseActivity.prototype.Pause = function (context) {
            return {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            };
        };
        PauseActivity.prototype.Resume = function (context, state) {
            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        };
        return PauseActivity;
    })();
    wfjs.PauseActivity = PauseActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=PauseActivity.js.map