module wfjs
{
    export class _Specifications
    {
        public static IsPaused = new Specification((o: ActivityContext) => o.StateData != null);
        public static IsWildcardDictionary = new Specification((o: Dictionary<any>) => o != null && o['*'] != null);
        public static IsWildcardArray = new Specification((o: string[]) => o != null && o.length == 1 && o[0] == '*');
    }
}