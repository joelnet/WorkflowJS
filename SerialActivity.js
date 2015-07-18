var wfjs;
(function (wfjs) {
    var SerialActivity = (function () {
        function SerialActivity(activities) {
            this.$inputs = null;
            this.$outputs = null;
            this._activities = activities || [];
        }
        SerialActivity.prototype.Execute = function (context, done) {
            var internalContext = new wfjs.ActivityContext({
                Extensions: context.Extensions,
                Inputs: context.Inputs,
                Outputs: context.Outputs
            });
            this.InternalExecute(0, internalContext, function (err) {
                if (context.Outputs != internalContext.Outputs) {
                    context.Outputs = internalContext.Outputs;
                }
                done(err);
            });
        };
        SerialActivity.prototype.InternalExecute = function (index, context, done) {
            var _this = this;
            var activity = this._activities[index];
            if (activity == null) {
                return done(null);
            }
            activity.Execute(context, function (err) {
                if (err != null) {
                    return done(err);
                }
                _this.CopyOutputsToInputs(context);
                _this.InternalExecute(++index, context, done);
            });
        };
        SerialActivity.prototype.CopyOutputsToInputs = function (context) {
            for (var key in (context.Outputs || {})) {
                context.Inputs[key] = context.Outputs[key];
            }
        };
        return SerialActivity;
    })();
    wfjs.SerialActivity = SerialActivity;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=SerialActivity.js.map