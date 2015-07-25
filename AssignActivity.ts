module wfjs
{
    export interface IAssignActivity extends IMapBase
    {
        values: Dictionary<any>;
        next?: string;
    }

    export var Assign = (options: IAssignActivity) =>
    {
        return options;
    };
}