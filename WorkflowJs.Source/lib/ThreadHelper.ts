module wfjs
{
    /**
     * ThreadHelper Helper methods for dealing with Multi-Threading.
     */
    export class ThreadHelper
    {
        /**
         * NewThread Creates a new Thread to execute the command
         */
        public static NewThread(fn: Function): void
        {
            setTimeout(() => fn(), 0);
        }
    }
}