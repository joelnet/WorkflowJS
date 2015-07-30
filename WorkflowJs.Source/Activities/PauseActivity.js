var wfjs;
(function (wfjs) {
    function Pause(options) {
        options = options || {};
        return wfjs.Execute({
            execute: null,
            next: wfjs._ObjectHelper.GetValue(options, 'next')
        });
        //return Activity({
        //    $inputs: { '*': '*' },
        //    $outputs: { '*': '*' },
        //    activity: new PauseActivity(options),
        //    next: options.next
        //});
    }
    wfjs.Pause = Pause;
    ;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=PauseActivity.js.map