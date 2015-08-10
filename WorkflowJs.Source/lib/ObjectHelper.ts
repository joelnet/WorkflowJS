module wfjs
{
    export class _ObjectHelper
    {
        /**
         * CopyProperties Copies properties source to the destination.
         */
        public static CopyProperties(source, destination): void
        {
            if (source == null || destination == null)
            {
                return;
            }

            for (var key in source)
            {
                destination[key] = source[key];
            }
        }

        /**
         * ToKeyValueArray Returns an array of KeyValuePair
         */
        public static ToKeyValueArray(obj): KeyValuePair<any>[]
        {
            return _ObjectHelper.GetKeys(obj)
                .map(key => new KeyValuePair<any>(key, obj[key]));
        }

        /**
         * GetKeys Returns an array of keys on the object.
         */
        public static GetKeys(obj): string[]
        {
            var keys: string[] = [];

            obj = obj || {};

            for (var key in obj)
            {
                if (obj.hasOwnProperty(key))
                { 
                    keys.push(key);
                }
            }

            return keys;
        }

        /**
         * GetValue recursive method to safely get the value of an object. to get the value of obj.point.x you would call
         *     it like this: GetValue(obj, 'point', 'x');
         *     If obj, point or x are null, null will be returned.
         */
        public static GetValue<T>(obj, ...params: any[]): T
        {
            return (params || [])
                .reduce(
                    (prev, cur) => prev == null ? prev : prev[cur],
                    obj);
        }

        /**
         * ShallowClone Returns a shallow clone of an Array or object.
         */
        public static ShallowClone(obj): any
        {
            if (obj == null)
            {
                return null;
            }

            return _Specifications.IsArray.IsSatisfiedBy(obj)
                ? this.ShallowCloneArray(obj)
                : this.ShallowCloneObject(obj);
        }

        /**
         * CombineObjects returns a new object with obj1 and obj2 combined.
         */
        public static CombineObjects(obj1, obj2): any
        {
            var clone = {};
            
            _ObjectHelper.CopyProperties(obj1, clone);
            _ObjectHelper.CopyProperties(obj2, clone);
            
            return clone;
        }

        /**
         * TrimObject Returns the a shallow clone of the object (excluding any values that are null, undefined or have no keys).
         */
        public static TrimObject<T>(obj: T): T
        {
            return _ObjectHelper.ToKeyValueArray(obj)
                .filter(kvp => kvp.value != null)
                .reduce(
                    (prev, cur) =>
                    {
                        prev[cur.key] = cur.value, prev;
                        return prev;
                    },
                    <T>{}
                );
        }

        /**
         * ShallowCloneArray returns a shallow clone of an array.
         */
        private static ShallowCloneArray(obj: any[]): any
        {
            return (obj || []).map(o => o);
        }

        /**
         * ShallowCloneObject returns a shallow clone of an object.
         */
        private static ShallowCloneObject(obj): any
        {
            var clone = {};

            for (var key in obj)
            {
                clone[key] = obj[key];
            }

            return clone;
        }
    }
}