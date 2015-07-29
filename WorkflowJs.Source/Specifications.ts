module wfjs
{
    export class _Specifications
    {
        public static IsPaused = new Specification((o: ActivityContext) => ObjectHelper.GetValue<WorkflowState>(o, 'State') == WorkflowState.Paused || ObjectHelper.GetValue(o, 'StateData') != null);
        public static IsWildcardDictionary = new Specification((o: Dictionary<any>) => ObjectHelper.GetValue(o, '*') != null);
        public static IsWildcardArray = new Specification((o: string[]) => ObjectHelper.GetValue(o, 0) == '*');
        public static Has$next = new Specification((o: ActivityContext) => ObjectHelper.GetValue(o, 'Outputs', '$next') != null);
        public static IsWorkflowActivity = new Specification((o: IActivityBase) => ObjectHelper.GetValue(o, 'activity') != null);
        public static IsExecutableActivity = new Specification((o: IActivity | IFlowchart) => typeof ObjectHelper.GetValue(o, 'Execute') == 'function');
    }
}