/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />
/// <reference path="./activities/ErrorActivity.js" />
/// <reference path="./activities/AsyncErrorActivity.js" />
/// <reference path="./activities/AddActivity.js" />

var expect = chai.expect;

test('Activity with Error is handled', function (done)
{
    var activity = new wfjsTests.Activities.ErrorActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke(function(err)
        {
            expect(err, 'We expect err to not be null').to.not.be.null;
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
            expect(err, 'We expect err to not be null').to.not.be.null;
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
            expect(err, 'We expect err to not be null').to.not.be.null;
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
            expect(err, 'We expect err to not be null').to.not.be.null;
            expect(err.message).to.equal('Activity expects input value: number2.');
            done();
        });
});

test('Activity executes correctly', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.be.null;
            expect(context, 'We expect context to be null').to.not.be.null;
            expect(context.Outputs, 'We expect context.Outputs to be null').to.not.be.null;
            expect(context.Outputs['total'], 'We expect context.Outputs["total"] to be 579').to.equal(579);

            done();
        });
});
