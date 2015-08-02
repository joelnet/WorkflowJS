/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />

var expect = chai.expect;

var basicFlowchart = wfjs.Flowchart({
    $inputs: ['in'],
    $outputs: ['out'],
    activities:
    {
        'start': wfjs.Assign({
            values:
            {
                'out': 'this.in + 100'
            }
        })
    }
});

var errorFlowchart = wfjs.Flowchart({
    $inputs: ['in'],
    $outputs: ['out'],
    activities:
    {
        'start': wfjs.Assign({
            values:
            {
                'out': 'in + 100' // error: must use 'this.in'
            }
        })
    }
});

var stringFlowchart = wfjs.Flowchart({
    $inputs: ['name'],
    $outputs: ['message'],
    activities:
    {
        'start': wfjs.Assign({
            values:
            {
                'message': '"Hello " + this.name + "!"'
            }
        })
    }
});

test('AssignActivity with compound value calculates correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicFlowchart)
        .Inputs({ 'in': 50 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to not be null').to.exist;
            expect(context.Outputs['out'], 'We expect context.Outputs["out"] to not be null').to.equal(150);

            done();
        });
});

test('AssignActivity with error in compound returns Error', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(errorFlowchart)
        .Inputs({ 'in': 50 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.exist;
            expect(err.message, 'We expect err.message to be "Parse error"').to.equal('Parse error');

            done();
        });
});

test('AssignActivity with string sets value', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(stringFlowchart)
        .Inputs({ 'name': 'test' })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to not be null').to.exist;
            expect(context.Outputs['message'], 'We expect context.Outputs["message"] to equal "Hello test!"').to.equal('Hello test!');

            done();
        });
});