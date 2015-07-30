/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />

var expect = chai.expect;

var emptyWorkflow = wfjs.Flowchart({});
var nullWorkflow = wfjs.Flowchart(null);

test('Workflow with null argument executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(nullWorkflow)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Inputs to not be null').to.exist;

            done();
        });
});

test('Empty Workflow executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(emptyWorkflow)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Inputs to not be null').to.exist;

            done();
        });
});