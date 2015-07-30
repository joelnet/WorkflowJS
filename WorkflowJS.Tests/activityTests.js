/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />
/// <reference path="./activities/ErrorActivity.js" />
/// <reference path="./activities/AsyncErrorActivity.js" />
/// <reference path="./activities/AddActivity.js" />

var expect = chai.expect;

test('Null Activity executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(null)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Inputs to not be null').to.exist;

            done();
        });
});

test('Activity with Error is handled', function (done)
{
    var activity = new wfjsTests.Activities.ErrorActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke(function(err)
        {
            expect(err, 'We expect err to not be null').to.exist;
            done();
        });
});

test('Activity with Async Error is handled', function (done)
{
    var activity = new wfjsTests.Activities.AsyncErrorActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke(function (err)
        {
            expect(err, 'We expect err to not be null').to.exist;
            done();
        });
});

test('Activity executed with no inputs handles error', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke(function (err)
        {
            expect(err, 'We expect err to not be null').to.exist;
            expect(err.message).to.equal('Activity expects input value: number1.');
            done();
        });
});

test('Activity executed with partial inputs handles error', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123 })
        .Invoke(function (err)
        {
            expect(err, 'We expect err to not be null').to.exist;
            expect(err.message).to.equal('Activity expects input value: number2.');
            done();
        });
});

test('Activity sets Output', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to be null').to.exist;
            expect(context.Outputs['total'], 'We expect context.Outputs["total"] to be 579').to.equal(579);

            done();
        });
});

test('Activity context has correct number of Inputs', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(wfjs._ObjectHelper.GetKeys(context.Inputs).length, 'We expect context.Inputs length to be 2').to.equal(2);

            done();
        });
});

test('Activity context has correct number of Outputs', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to be null').to.exist;
            expect(wfjs._ObjectHelper.GetKeys(context.Outputs).length, 'We expect context.Outputs length to be 1').to.equal(1);

            done();
        });
});

