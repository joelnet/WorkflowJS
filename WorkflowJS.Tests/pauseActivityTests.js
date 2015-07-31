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
        'start': wfjs.Pause(
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

test('PauseActivity sets StateData', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicWorkflow)
        .Inputs({ name: 'test' })
        .Invoke(function(err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.StateData, 'We expect context.StateData to exist').to.exist;
            expect(context.State, 'We expect context.State to be Paused').to.equal(wfjs.WorkflowState.Paused);
            expect(context.Outputs, 'We expect context.Outputs to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to not exist').to.not.exist;

            done();
        })
});

test('PauseActivity with State resumes', function (done)
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

