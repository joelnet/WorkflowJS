module wfjs
{
    export class _Specifications
    {
        public static IsPaused = new Specification((o: ActivityContext) => ObjectHelper.GetValue(o, 'StateData') != null);
        public static IsWildcardDictionary = new Specification((o: Dictionary<any>) => ObjectHelper.GetValue(o, '*') != null);
        public static IsWildcardArray = new Specification((o: string[]) => ObjectHelper.GetValue(o, 0) == '*');
        public static Has$next = new Specification((o: ActivityContext) => ObjectHelper.GetValue(o, 'Outputs', '$next') != null);
    }
}