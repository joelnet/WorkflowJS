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
            expect(context.State, 'We expect context.State to be Complete').to.equal(wfjs.WorkflowState.Complete);

            done();
        });
});

test('Activity with Error returns Error', function (done)
{
    var activity = new wfjsTests.Activities.ErrorActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity, context)
        .Invoke(function(err, context)
        {
            expect(err, 'We expect err to not be null').to.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.State, 'We expect context.State to be Fault').to.equal(wfjs.WorkflowState.Fault);
            
            done();
        });
});

test('Activity with Async Error returns Error', function (done)
{
    var activity = new wfjsTests.Activities.AsyncErrorActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to exist').to.exist;
            expect(context.State, 'We expect context.State to be Fault').to.equal(wfjs.WorkflowState.Fault);
         
            done();
        });
});

test('Activity executed with no required inputs returns Error', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not be null').to.exist;
            expect(err.message).to.equal('Activity expects input value: number1.');
            expect(context.State, 'We expect context.State to be Fault').to.equal(wfjs.WorkflowState.Fault);

            done();
        });
});

test('Activity executed with partial required inputs returns Error', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not be null').to.exist;
            expect(err.message).to.equal('Activity expects input value: number2.');
            expect(context.State, 'We expect context.State to be Fault').to.equal(wfjs.WorkflowState.Fault);
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
            expect(context.State, 'We expect context.State to be Complete').to.equal(wfjs.WorkflowState.Complete);
            expect(context, 'We expect context to be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to be null').to.exist;
            expect(context.Outputs['total'], 'We expect context.Outputs["total"] to be 579').to.equal(579);

            done();
        });
});

test('Activity return context with Inputs', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context.State, 'We expect context.State to be Complete').to.equal(wfjs.WorkflowState.Complete);
            expect(context, 'We expect context to be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(wfjs._ObjectHelper.GetKeys(context.Inputs).length, 'We expect context.Inputs length to be 2').to.equal(2);

            done();
        });
});

test('Activity returns context with Outputs', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context.State, 'We expect context.State to be Complete').to.equal(wfjs.WorkflowState.Complete);
            expect(context, 'We expect context to be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to be null').to.exist;
            expect(wfjs._ObjectHelper.GetKeys(context.Outputs).length, 'We expect context.Outputs length to be 1').to.equal(1);

            done();
        });
});

test('Activity without required Outputs returns Error', function (done)
{
    var activity = new wfjsTests.Activities.AddActivity();
    activity.Execute = function() {};

    wfjs.WorkflowInvoker
        .CreateActivity(activity)
        .Inputs({ number1: 123, number2: 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.exist;
            expect(err.message, 'We expect err.essage to be set').to.equal('Activity expects output value: total.');

            done();
        });
});