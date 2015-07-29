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
            context.State = 3 /* Paused */;
            done();
        };
        return PauseActivity;
    })();
    wfjs.PauseActivity = PauseActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=PauseActivity.js.map