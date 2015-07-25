module wfjs
{
    export class _Specifications
    {
        public static IsPaused = new Specification((o: ActivityContext) => o.StateData != null);
    }
}