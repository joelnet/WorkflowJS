module wfjs
{
    export class _Specifications
    {
        public static IsPaused = new _Specification((o: ActivityContext) => _ObjectHelper.GetValue<WorkflowState>(o, 'State') == WorkflowState.Paused || _ObjectHelper.GetValue(o, 'StateData') != null);
        public static IsWildcardDictionary = new _Specification((o: Dictionary<any>) => _ObjectHelper.GetValue(o, '*') != null);
        public static IsWildcardArray = new _Specification((o: string[]) => _ObjectHelper.GetValue(o, 0) == '*');
        public static Has$next = new _Specification((o: ActivityContext) => _ObjectHelper.GetValue(o, 'Outputs', '$next') != null);
        public static IsWorkflowActivity = new _Specification((o: IActivityBase) => _ObjectHelper.GetValue(o, 'activity') != null);
        public static IsExecutableActivity = new _Specification((o: IActivity | IFlowchart) => typeof _ObjectHelper.GetValue(o, 'Execute') == 'function');
        public static IsExecuteAsync = new _Specification((o: Function) => o != null && _FunctionHelper.ParameterCount(o) >= 2);
    }
}