var wfjs;
(function (wfjs) {
    var _bll;
    (function (_bll) {
        var Workflow = (function () {
            function Workflow() {
            }
            /**
              * GetStartActivityName Gets the name of the to be executed first.
              */
            Workflow.GetStartActivityName = function (activities, state) {
                var hasStateNext = state != null && state.n != null;
                var activityName = hasStateNext ? state.n : Object.keys(activities)[0];
                return activities[activityName] != null ? activityName : null;
            };
            /**
             * GetNextActivityName returns the name of the next Activity or null.
             */
            Workflow.GetNextActivityName = function (activity, activities) {
                if (activity == null) {
                    return null;
                }
                var activityName = wfjs.ObjectHelper.GetValue(activity, 'next');
                return activities[activityName] != null ? activityName : null;
            };
            return Workflow;
        })();
        _bll.Workflow = Workflow;
    })(_bll = wfjs._bll || (wfjs._bll = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Workflow.js.map