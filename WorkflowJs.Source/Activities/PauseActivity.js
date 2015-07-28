var wfjs;
(function (wfjs) {
    wfjs.Pause = function (options) {
        options = options || {};
        return wfjs.Activity({
            $inputs: { '*': '*' },
            $outputs: { '*': '*' },
            activity: new PauseActivity(options),
            next: options.next
        });
    };
    var PauseActivity = (function () {
        function PauseActivity(options) {
            this.$inputs = ['*'];
            this.$outputs = ['*'];
            if (options != null) {
                this.next = options.next;
            }
        }
        PauseActivity.prototype.Execute = function (context, done) {
            context.StateData = {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            };
            done();
        };
        PauseActivity.prototype.Resume = function (context, state) {
            throw new Error('Not Implemented');
            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        };
        return PauseActivity;
    })();
    wfjs.PauseActivity = PauseActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=PauseActivity.js.map