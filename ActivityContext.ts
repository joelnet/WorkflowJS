module wfjs
{
    export interface ActivityContextOptions
    {
        Extensions?: Dictionary<any>;
        Inputs?: Dictionary<any>;
        Outputs?: Dictionary<any>;
    }

    export class ActivityContext
    {
        public Extensions: Dictionary<any>;
        public Inputs: Dictionary<any>;
        public Outputs: Dictionary<any>;

        constructor(options: ActivityContextOptions)
        {
            this.Extensions = options.Extensions || {};
            this.Inputs = options.Inputs || {};
            this.Outputs = options.Outputs || {};
        }
    }
}