module wfjs
{
    export class ObjectHelper
    {
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

        public static GetKeys(obj): string[]
        {
            var keys: string[] = [];

            for (var key in (obj || {}))
            {
                keys.push(key);
            }

            return keys;
        }

        public static GetValue(obj, ...params: any[]): any
        {
            var value = null;
            var length = (params||[]).length;

            if (length == 0)
            {
                return obj;
            }

            for (var i = 0; i < length; i++)
            {
                obj = obj[params[i]];

                if (obj == null)
                {
                    break;
                }
                else if (i == length - 1)
                {
                    value = obj;
                }
            }

            return value;
        }

        public static ShallowClone(obj): any
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

        public static CombineObjects(obj1, obj2): any
        {
            var clone = {};
            
            ObjectHelper.CopyProperties(obj1, clone);
            ObjectHelper.CopyProperties(obj2, clone);
            
            return clone;
        }

        private static ShallowCloneArray(obj: any[]): any
        {
            var clone = [];

            for (var i = 0; i < obj.length; i++)
            {
                clone.push(obj[i]);
            }

            return clone;
        }

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