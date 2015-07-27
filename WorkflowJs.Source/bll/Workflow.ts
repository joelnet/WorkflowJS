module wfjs._bll
{
    export class Workflow
    {
        /**
          * GetStartActivityName Gets the name of the to be executed first.
          */
        public static GetStartActivityName(activities: Dictionary<IActivityBase>, state: IPauseState): string
        {
            var hasStateNext = state != null && state.n != null;
            var activityName: string = hasStateNext ? state.n : Object.keys(activities)[0];

            return activities[activityName] != null ? activityName : null;
        }

        /**
         * GetNextActivityName returns the name of the next Activity or null.
         */
        public static GetNextActivityName(activity: IActivityBase, activities: Dictionary<IActivityBase>): string
        {
            if (activity == null)
            {
                return null;
            }

            var activityName: string = ObjectHelper.GetValue(activity, 'next');

            return activities[activityName] != null ? activityName : null;
        }
    }
}