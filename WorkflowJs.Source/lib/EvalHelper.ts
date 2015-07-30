module wfjs
{
    export class _EvalHelper
    {
        public static Eval(thisArg, code: string): any
        {
            var contextEval = function()
            {
                return eval(code);
            };

            return contextEval.call(thisArg);
        }
    }
}