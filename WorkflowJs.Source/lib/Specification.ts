module wfjs
{
    export class Specification<T>
    {
        private _criteria: (obj: T) => boolean;

        constructor(criteria: (obj: T) => boolean)
        {
            this._criteria = criteria;
        }

        public IsSatisfiedBy(value: T): boolean
        {
            return this._criteria(value);
        }
    }
}
