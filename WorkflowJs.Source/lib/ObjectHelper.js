var wfjs;
(function (wfjs) {
    var _ObjectHelper = (function () {
        function _ObjectHelper() {
        }
        /**
         * CopyProperties Copies properties source to the destination.
         */
        _ObjectHelper.CopyProperties = function (source, destination) {
            if (source == null || destination == null) {
                return;
            }
            for (var key in source) {
                destination[key] = source[key];
            }
        };
        /**
         * ToKeyValueArray Returns an array of KeyValuePair
         */
        _ObjectHelper.ToKeyValueArray = function (obj) {
            return _ObjectHelper.GetKeys(obj).map(function (key) { return new wfjs.KeyValuePair(key, obj[key]); });
        };
        /**
         * GetKeys Returns an array of keys on the object.
         */
        _ObjectHelper.GetKeys = function (obj) {
            var keys = [];
            obj = obj || {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        /**
         * GetValue recursive method to safely get the value of an object. to get the value of obj.point.x you would call
         *     it like this: GetValue(obj, 'point', 'x');
         *     If obj, point or x are null, null will be returned.
         */
        _ObjectHelper.GetValue = function (obj) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            return (params || []).reduce(function (prev, cur) { return prev == null ? prev : prev[cur]; }, obj);
        };
        /**
         * ShallowClone Returns a shallow clone of an Array or object.
         */
        _ObjectHelper.ShallowClone = function (obj) {
            if (obj == null) {
                return null;
            }
            return wfjs._Specifications.IsArray.IsSatisfiedBy(obj) ? this.ShallowCloneArray(obj) : this.ShallowCloneObject(obj);
        };
        /**
         * CombineObjects returns a new object with obj1 and obj2 combined.
         */
        _ObjectHelper.CombineObjects = function (obj1, obj2) {
            var clone = {};
            _ObjectHelper.CopyProperties(obj1, clone);
            _ObjectHelper.CopyProperties(obj2, clone);
            return clone;
        };
        /**
         * TrimObject Returns the a shallow clone of the object (excluding any values that are null, undefined or have no keys).
         */
        _ObjectHelper.TrimObject = function (obj) {
            return _ObjectHelper.ToKeyValueArray(obj).filter(function (kvp) { return kvp.value != null; }).reduce(function (prev, cur) {
                prev[cur.key] = cur.value, prev;
                return prev;
            }, {});
        };
        /**
         * ShallowCloneArray returns a shallow clone of an array.
         */
        _ObjectHelper.ShallowCloneArray = function (obj) {
            return (obj || []).map(function (o) { return o; });
        };
        /**
         * ShallowCloneObject returns a shallow clone of an object.
         */
        _ObjectHelper.ShallowCloneObject = function (obj) {
            var clone = {};
            for (var key in obj) {
                clone[key] = obj[key];
            }
            return clone;
        };
        return _ObjectHelper;
    })();
    wfjs._ObjectHelper = _ObjectHelper;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=ObjectHelper.js.map