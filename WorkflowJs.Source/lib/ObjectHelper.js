var wfjs;
(function (wfjs) {
    var _ObjectHelper = (function () {
        function _ObjectHelper() {
        }
        _ObjectHelper.CopyProperties = function (source, destination) {
            if (source == null || destination == null) {
                return;
            }
            for (var key in source) {
                destination[key] = source[key];
            }
        };
        _ObjectHelper.GetKeys = function (obj) {
            var keys = [];
            for (var key in (obj || {})) {
                keys.push(key);
            }
            return keys;
        };
        _ObjectHelper.GetValue = function (obj) {
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
        _ObjectHelper.ShallowClone = function (obj) {
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
            var clone = _ObjectHelper.ShallowClone(obj);
            for (var key in clone || {}) {
                var keys = _ObjectHelper.GetKeys(clone[key]);
                if (clone[key] == null || keys.length == 0 || clone.length == 0) {
                    delete clone[key];
                }
            }
            return clone;
        };
        _ObjectHelper.ShallowCloneArray = function (obj) {
            var clone = [];
            for (var i = 0; i < obj.length; i++) {
                clone.push(obj[i]);
            }
            return clone;
        };
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