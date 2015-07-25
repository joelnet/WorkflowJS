module wfjs
{
    export class ObjectHelper
    {
        public static GetKeys(obj): string[]
        {
            var keys: string[] = [];

            for (var key in (obj || {}))
            {
                keys.push(key);
            }

            return keys;
        }

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

        public static ShallowClone(obj)
        {
            if (obj == null)
            {
                return null;
            }

            var isArray = Object.prototype.toString.call(obj) == '[object Array]';

            if (isArray)
            {
                return this.ShallowCloneArray(obj);
            }
            else
            {
                return this.ShallowCloneObject(obj);
            }
        }

        private static ShallowCloneArray(obj: any[])
        {
            var clone = [];

            for (var i = 0; i < obj.length; i++)
            {
                clone.push(obj[i]);
            }

            return clone;
        }

        private static ShallowCloneObject(obj)
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