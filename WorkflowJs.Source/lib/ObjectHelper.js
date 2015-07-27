var wfjs;
(function (wfjs) {
    var ObjectHelper = (function () {
        function ObjectHelper() {
        }
        ObjectHelper.CopyProperties = function (source, destination) {
            if (source == null || destination == null) {
                return;
            }
            for (var key in source) {
                destination[key] = source[key];
            }
        };
        ObjectHelper.GetKeys = function (obj) {
            var keys = [];
            for (var key in (obj || {})) {
                keys.push(key);
            }
            return keys;
        };
        ObjectHelper.GetValue = function (obj) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var value = null;
            var length = (params || []).length;
            if (obj == null || length == 0) {
                return obj;
            }
            for (var i = 0; i < length; i++) {
                obj = obj[params[i]];
                if (obj == null) {
                    break;
                }
                else if (i == length - 1) {
                    value = obj;
                }
            }
            return value;
        };
        ObjectHelper.ShallowClone = function (obj) {
            if (obj == null) {
                return null;
            }
            var isArray = Object.prototype.toString.call(obj) == '[object Array]';
            if (isArray) {
                return this.ShallowCloneArray(obj);
            }
            else {
                return this.ShallowCloneObject(obj);
            }
        };
        ObjectHelper.CombineObjects = function (obj1, obj2) {
            var clone = {};
            ObjectHelper.CopyProperties(obj1, clone);
            ObjectHelper.CopyProperties(obj2, clone);
            return clone;
        };
        ObjectHelper.ShallowCloneArray = function (obj) {
            var clone = [];
            for (var i = 0; i < obj.length; i++) {
                clone.push(obj[i]);
            }
            return clone;
        };
        ObjectHelper.ShallowCloneObject = function (obj) {
            var clone = {};
            for (var key in obj) {
                clone[key] = obj[key];
            }
            return clone;
        };
        return ObjectHelper;
    })();
    wfjs.ObjectHelper = ObjectHelper;
})(wfjs || (wfjs = {}));
//# sourceMappingURL=ObjectHelper.js.map