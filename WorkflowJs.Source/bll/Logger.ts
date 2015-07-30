module wfjs._bll
{
    export class Logger
    {
        /**
         * _log Sends message and optionalParams to the logger.
         */
        public static Log(logger: Console, logType: LogType, message: any, ...optionalParams: any[]): void
        {
            var log = Logger._getLogFunction(logger, logType);
            var args = [message].concat(optionalParams || []);

            if (log != null)
            {
                log.apply(logger, args);
            }
        }

        /**
         * _getLogFunction returns the log function for the LogType. Falls back to 'log' if others aren't available.
         */
        private static _getLogFunction(logger: Console, logType: LogType): Function
        {
            var log = _ObjectHelper.GetValue<Function>(logger, 'log');

            switch (logType)
            {
                case LogType.Debug:  return _ObjectHelper.GetValue<Function>(logger, 'debug') || log;
                case LogType.Info:   return _ObjectHelper.GetValue<Function>(logger, 'info') || log;
                case LogType.Warn:   return _ObjectHelper.GetValue<Function>(logger, 'warn') || log;
                case LogType.Error:  return _ObjectHelper.GetValue<Function>(logger, 'error') || log;
                default:             return log;
            }
        }
    }
}