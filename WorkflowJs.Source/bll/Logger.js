var wfjs;
(function (wfjs) {
    var _bll;
    (function (_bll) {
        var Logger = (function () {
            function Logger() {
            }
            /**
             * _log Sends message and optionalParams to the logger.
             */
            Logger.Log = function (logger, logType, message) {
                var optionalParams = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    optionalParams[_i - 3] = arguments[_i];
                }
                var log = Logger._getLogFunction(logger, logType);
                var args = [message].concat(optionalParams || []);
                if (log != null) {
                    log.apply(logger, args);
                }
            };
            /**
             * _getLogFunction returns the log function for the LogType. Falls back to 'log' if others aren't available.
             */
            Logger._getLogFunction = function (logger, logType) {
                var log = wfjs._ObjectHelper.GetValue(logger, 'log');
                switch (logType) {
                    case 1 /* Debug */: return wfjs._ObjectHelper.GetValue(logger, 'debug') || log;
                    case 2 /* Info */: return wfjs._ObjectHelper.GetValue(logger, 'info') || log;
                    case 3 /* Warn */: return wfjs._ObjectHelper.GetValue(logger, 'warn') || log;
                    case 4 /* Error */: return wfjs._ObjectHelper.GetValue(logger, 'error') || log;
                    default: return log;
                }
            };
            return Logger;
        })();
        _bll.Logger = Logger;
    })(_bll = wfjs._bll || (wfjs._bll = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=Logger.js.map