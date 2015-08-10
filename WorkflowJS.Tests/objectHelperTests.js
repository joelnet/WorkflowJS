/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />

var expect = chai.expect;
var ObjectHelper = wfjs._ObjectHelper;
var testObject1 = {
    a: 1,
    b: 'two',
    c: null
};

test('ObjectHelper.CopyProperties with null source doesnt error.', function ()
{
    var result = {};
    
    ObjectHelper.CopyProperties(null, result);

    expect(JSON.stringify(result)).to.equal(JSON.stringify({}));
});

test('ObjectHelper.CopyProperties with null destination doesnt error.', function ()
{
    var result = null;

    ObjectHelper.CopyProperties(testObject1, result);

    expect(result).to.be.null;
});

test('ObjectHelper.CopyProperties copies source to destination.', function ()
{
    var result = {};

    ObjectHelper.CopyProperties(testObject1, result);

    expect(result.a).to.equal(testObject1.a);
    expect(result.b).to.equal(testObject1.b);
    expect(result.c).to.equal(testObject1.c);
});

test('ObjectHelper.CopyProperties overwrites values on destination.', function ()
{
    var result = { a: 7 };

    ObjectHelper.CopyProperties(testObject1, result);

    expect(result.a).to.equal(testObject1.a);
    expect(result.b).to.equal(testObject1.b);
    expect(result.c).to.equal(testObject1.c);
});

test('ObjectHelper.ToKeyValueArray with null returns empty array.', function ()
{
    var result = ObjectHelper.ToKeyValueArray(null);

    expect(result).to.exist;
    expect(result.length).to.equal(0);
});

test('ObjectHelper.ToKeyValueArray with array returns KeyValuePair array.', function ()
{
    var result = ObjectHelper.ToKeyValueArray(['a', 'b', 'c']);

    expect(result).to.exist;
    expect(result.length).to.equal(3);
    expect(result[0].key).to.equal('0');
    expect(result[0].value).to.equal('a');
    expect(result[1].key).to.equal('1');
    expect(result[1].value).to.equal('b');
    expect(result[2].key).to.equal('2');
    expect(result[2].value).to.equal('c');
});

test('ObjectHelper.ToKeyValueArray with object returns KeyValuePair array.', function ()
{
    var result = ObjectHelper.ToKeyValueArray(testObject1);

    expect(result).to.exist;
    expect(result.length).to.equal(3);
    expect(result[0].key).to.equal('a');
    expect(result[0].value).to.equal(1);
    expect(result[1].key).to.equal('b');
    expect(result[1].value).to.equal('two');
    expect(result[2].key).to.equal('c');
    expect(result[2].value).to.be.null;
});

test('ObjectHelper.GetKeys with object returns KeyValuePair array.', function ()
{
    var result = ObjectHelper.GetKeys(testObject1);

    expect(result).to.exist;
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal('a');
    expect(result[1]).to.equal('b');
    expect(result[2]).to.equal('c');
});

test('ObjectHelper.GetKeys with array returns KeyValuePair array.', function ()
{
    var result = ObjectHelper.GetKeys(['a', 'b', 'c']);

    expect(result).to.exist;
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal('0');
    expect(result[1]).to.equal('1');
    expect(result[2]).to.equal('2');
});

test('ObjectHelper.GetValue with null returns null.', function ()
{
    var result = ObjectHelper.GetValue(null);

    expect(result).to.be.null;
});

test('ObjectHelper.GetValue with undefined returns undefined.', function ()
{
    var result = ObjectHelper.GetValue(undefined);

    expect(result).to.be.undefined;
});

test('ObjectHelper.GetValue with number returns number.', function ()
{
    var result = ObjectHelper.GetValue(42);

    expect(result).to.equal(42);
});

test('ObjectHelper.GetValue with string returns string.', function ()
{
    var result = ObjectHelper.GetValue('success');

    expect(result).to.equal('success');
});

test('ObjectHelper.GetValue with object returns value.', function ()
{
    var obj = {
        level1: {
            level2: 'success'
        }
    };

    var result = ObjectHelper.GetValue(obj, 'level1', 'level2');

    expect(result).to.equal(obj.level1.level2);
});

test('ObjectHelper.ShallowClone with null returns null.', function ()
{
    var result = ObjectHelper.ShallowClone(null);

    expect(result).to.be.null;
});

test('ObjectHelper.ShallowClone with array returns array.', function ()
{
    var original = [1, 2, 3];

    var result = ObjectHelper.ShallowClone(original);

    result.push(4);

    expect(original.length).to.equal(3);
    expect(result.length).to.equal(4);
    expect(result[0]).to.equal(1);
    expect(result[1]).to.equal(2);
    expect(result[2]).to.equal(3);
});

test('ObjectHelper.ShallowClone with object returns object.', function ()
{
    var result = ObjectHelper.ShallowClone(testObject1);

    result['new'] = true;

    expect(testObject1['new']).to.not.exist;
});

test('ObjectHelper.CombineObjects with null obj1 returns clone of obj2.', function ()
{
    var result = ObjectHelper.CombineObjects(null, testObject1);

    expect(result.a).to.equal(testObject1.a);
    expect(result.b).to.equal(testObject1.b);
    expect(result.c).to.equal(testObject1.c);
});

test('ObjectHelper.CombineObjects with null obj2 returns clone of obj2.', function ()
{
    var result = ObjectHelper.CombineObjects(testObject1, null);

    expect(result.a).to.equal(testObject1.a);
    expect(result.b).to.equal(testObject1.b);
    expect(result.c).to.equal(testObject1.c);
});

test('ObjectHelper.CombineObjects does not modify original objects', function ()
{
    var obj2 = { z: 'success' };

    var result = ObjectHelper.CombineObjects(testObject1, obj2);

    result['new'] = true;

    expect(testObject1['new']).to.not.exist;
    expect(obj2['new']).to.not.exist;
});

test('ObjectHelper.CombineObjects combines objects', function ()
{
    var obj2 = { z: 'success' };

    var result = ObjectHelper.CombineObjects(testObject1, obj2);

    expect(result).to.exist;
    expect(result.a).to.equal(testObject1.a);
    expect(result.b).to.equal(testObject1.b);
    expect(result.c).to.equal(testObject1.c);
    expect(result.z).to.equal(obj2.z);

});

test('ObjectHelper.CombineObjects properties in obj2 overwrite properties from obj1.', function ()
{
    var obj2 = { b: 'success' };

    var result = ObjectHelper.CombineObjects(testObject1, obj2);

    expect(result).to.exist;
    expect(result.b).to.equal(obj2.b);

});

test('ObjectHelper.TrimObject returns a clone of obj without null values.', function ()
{
    var obj2 = {
        a: 'success',
        b: 1,
        c: null,
        d: [],
        e: undefined
    };

    var result = ObjectHelper.TrimObject(obj2);

    expect(result).to.exist;
    expect(result.a).to.equal(obj2.a);
    expect(result.b).to.equal(obj2.b);
    expect(result.c).to.not.exist;
    expect(result.d).to.exist;
    expect(result.d.length).to.equal(0);
    expect(result.e).to.not.exist;

});