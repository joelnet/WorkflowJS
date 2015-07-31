var wfjs;
(function (wfjs) {
    function Pause(options) {
        options = options || {};
        return wfjs.Execute({
            execute: function (context) {
                context.State = 3 /* Paused */;
            },
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
    }
    wfjs.Pause = Pause;
    ;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=PauseActivity.js.map