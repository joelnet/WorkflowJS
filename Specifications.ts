module wfjs
{
    export class Specifications
    {
        public static _IsPaused = new Specification((o: ActivityContext) => o.State != null);
    }
}