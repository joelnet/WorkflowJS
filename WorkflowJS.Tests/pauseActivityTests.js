/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />
/// <reference path="./activities/ErrorActivity.js" />
/// <reference path="./activities/AsyncErrorActivity.js" />
/// <reference path="./activities/AddActivity.js" />

var expect = chai.expect;
var basicWorkflow = new wfjs.Flowchart({
    $inputs: ['name'],
    $outputs: ['result'],
    activities:
    {
        'start': wfjs.Assign(
        {
            values:
            {
                'internalValue': true
            },
            next: 'pause'
        }),
        'pause': wfjs.Pause(
        {
            next: 'end'
        }),
        'end': wfjs.Execute(
        {
            execute: function (context)
            {
                context.Outputs['result'] = 'Hello ' + context.Inputs['name'] + '!';
            }
        })
    }
});

test('PauseActivity with Pause sets Inputs.length to 1', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .Inputs({ name: 'test' })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.StateData, 'We expect context.StateData to exist').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to exist').to.exist;
            expect(wfjs._ObjectHelper.GetKeys(context.Inputs).length, 'We expect context.Inputs.length to equal 1').to.equal(1);

            done();
        })
});

test('PauseActivity with Pause sets Outputs.length to 0', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .Inputs({ name: 'test' })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.StateData, 'We expect context.StateData to exist').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to exist').to.exist;
            expect(wfjs._ObjectHelper.GetKeys(context.Outputs).length, 'We expect context.Outputs.length to equal 0').to.equal(0);

            done();
        })
});

test('PauseActivity with Pause returns StateData', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .Inputs({ name: 'test' })
        .Invoke(function(err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.StateData, 'We expect context.StateData to exist').to.exist;
            expect(context.StateData.i.name, 'We expect context.StateData.i.name to equal "test"').to.equal('test');
            expect(context.StateData.n, 'We expect context.StateData.n to equal "end"').to.equal('end');

            done();
        })
});

test('PauseActivity with Pause sets State to Paused', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .Inputs({ name: 'test' })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.State, 'We expect context.State to be Paused').to.equal(wfjs.WorkflowState.Paused);

            done();
        })
});


test('PauseActivity with Pause does not return internal values', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .Inputs({ name: 'test' })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to exist').to.exist;
            expect(context.Outputs['internalValue'], 'We expect context.Outputs["result"] to not exist').to.not.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to not exist').to.not.exist;

            done();
        })
});

test('PauseActivity with State resumes and Completes', function (done)
{
    var state = {"i":{"name":"test"},"o":{},"n":"end"};

    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .State(state)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.StateData, 'We expect context.StateData to exist').to.not.exist;
            expect(context.State, 'We expect context.State to be Complete').to.equal(wfjs.WorkflowState.Complete);

            done();
        })
});

