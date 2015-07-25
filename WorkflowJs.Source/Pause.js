var wfjs;
(function (wfjs) {
    wfjs.Pause = function (options) {
        return new WorkflowPause(options);
    };
    var WorkflowPause = (function () {
        function WorkflowPause(options) {
            this._type = 'pause';
            if (options != null) {
                this.next = options.next;
            }
        }
        WorkflowPause.prototype.Pause = function (context) {
            return {
                i: context.Inputs,
                o: context.Outputs,
                n: this.next
            };
        };
        WorkflowPause.prototype.Resume = function (context, state) {
            context.Inputs = state.i;
            context.Outputs = state.o;
            this.next = state.n;
        };
        return WorkflowPause;
    })();
    wfjs.WorkflowPause = WorkflowPause;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Pause.js.map