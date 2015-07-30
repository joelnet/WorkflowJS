/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />
/// <reference path="./activities/ErrorActivity.js" />
/// <reference path="./activities/AsyncErrorActivity.js" />
/// <reference path="./activities/AddActivity.js" />

var expect = chai.expect;

test('ExecuteActivity with $inputs sets $outputs.', function (done)
{
    var workflow = new wfjs.Flowchart({
        $inputs: ['name'],
        $outputs: ['result'],
        activities:
        {
            'start': wfjs.Execute(
            {
                execute: function(context)
                {
                    context.Outputs['result'] = 'Hello ' + context.Inputs['name'] + '!';
                }
            })
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Inputs({ name: 'test' })
        .Invoke(function(err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to equal "success"').to.equal('Hello test!');

            done();
        })
});

test('ExecuteActivity with Sync Activity returns success.', function (done)
{
    var workflow = new wfjs.Flowchart({
        $outputs: ['result'],
        activities:
        {
            'start': wfjs.Execute(
            {
                execute: function (context)
                {
                    context.Outputs['result'] = 'success';
                }
            })
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to equal "success"').to.equal('success');

            done();
        })
});

test('ExecuteActivity with Async Activity returns success.', function (done)
{
    var workflow = new wfjs.Flowchart({
        $outputs: ['result'],
        activities:
        {
            'start': wfjs.Execute(
            {
                execute: function (context, done)
                {
                    context.Outputs['result'] = 'success';
                    done();
                }
            })
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.not.exist;
            expect(context, 'We expect context to exist').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to exist').to.exist;
            expect(context.Outputs['result'], 'We expect context.Outputs["result"] to equal "success"').to.equal('success');

            done();
        })
});

test('ExecuteActivity with Sync exception returns err.', function (done)
{
    var workflow = new wfjs.Flowchart({
        $outputs: ['result'],
        activities:
        {
            'start': wfjs.Execute(
            {
                execute: function (context)
                {
                    throw new Error('error!');
                }
            })
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.exist;

            done();
        })
});

test('ExecuteActivity with Async exception returns err.', function (done)
{
    var workflow = new wfjs.Flowchart({
        $outputs: ['result'],
        activities:
        {
            'start': wfjs.Execute(
            {
                execute: function (context, done)
                {
                    return done(new Error('error!'));
                }
            })
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(workflow)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to not exist').to.exist;

            done();
        })
});