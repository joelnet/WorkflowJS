/// <reference path="./lib/chai.js" />
/// <reference path="./lib/mocha.js" />
/// <reference path="./lib/workflow.js" />
/// <reference path="./activities/AddActivity.js" />

var expect = chai.expect;

var emptyFlowchart = wfjs.Flowchart({});
var nullFlowchart = wfjs.Flowchart(null);
var undefinedFlowchart = wfjs.Flowchart();
var basicFlowchart = wfjs.Flowchart({
    $inputs: ['number1', 'number2'],
    $outputs: ['total'],
    activities:
    {
        'start': wfjs.Activity({
            $inputs:
            {
                'number1': 'this.number1',
                'number2': 'this.number2'
            },
            $outputs:
            {
                'total': 'total'
            },
            activity: new wfjsTests.Activities.AddActivity()
        })
    }
});
var compundVariableFlowchart = wfjs.Flowchart({
    $inputs: ['number1', 'number2'],
    $outputs: ['total'],
    activities:
    {
        'start': wfjs.Activity({
            $inputs:
            {
                'number1': 'this.number1',
                'number2': 'this.number2 + 100'
            },
            $outputs:
            {
                'total': 'total'
            },
            activity: new wfjsTests.Activities.AddActivity()
        })
    }
});

test('Workflow with null argument executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(nullFlowchart)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to not be null').to.exist;

            done();
        });
});

test('Workflow with undefined argument executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(undefinedFlowchart)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to not be null').to.exist;

            done();
        });
});

test('Empty Workflow executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(emptyFlowchart)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Inputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Outputs to not be null').to.exist;

            done();
        });
});

test('Basic Workflow executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicFlowchart)
        .Inputs({ 'number1': 123, 'number2': 456})
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs['total'], 'We expect context.Outputs["total"] to be 579').to.equal(579);

            done();
        });
});

test('Compound Variable Workflow executes correctly', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(compundVariableFlowchart)
        .Inputs({ 'number1': 123, 'number2': 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.not.exist;
            expect(context, 'We expect context to not be null').to.exist;
            expect(context.Outputs, 'We expect context.Inputs to not be null').to.exist;
            expect(context.Outputs['total'], 'We expect context.Outputs["total"] to be 679').to.equal(679);

            done();
        });
});

test('Flowchart with $input error returns Error', function (done)
{
    var flowchart = wfjs.Flowchart({
        $inputs: ['number1', 'number2'],
        $outputs: ['total'],
        activities:
        {
            'start': wfjs.Activity({
                $inputs:
                {
                    'number1': 'this.number1',
                    'number2': 'this.number2 + 1z00'
                },
                $outputs:
                {
                    'total': 'total'
                },
                activity: new wfjsTests.Activities.AddActivity()
            })
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(flowchart)
        .Inputs({ 'number1': 123, 'number2': 456 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.exist;
            expect(err.toString()).to.equal('SyntaxError: Parse error');

            done();
        });
});

test('Flowchart without $inputs returns Error', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicFlowchart)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.exist;
            expect(err.toString()).to.equal('Error: Activity expects input value: number1.');

            done();
        });
});

test('Flowchart with partial $inputs returns Error', function (done)
{
    wfjs.WorkflowInvoker
        .CreateActivity(basicFlowchart)
        .Inputs({ 'number1': 123 })
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.exist;
            expect(err.toString()).to.equal('Error: Activity expects input value: number2.');

            done();
        });
});

test('Flowchart without $output returns Error', function (done)
{
    var flowchart = wfjs.Flowchart({
        $outputs: ['total'],
        activities:
        {
        }
    });

    wfjs.WorkflowInvoker
        .CreateActivity(flowchart)
        .Invoke(function (err, context)
        {
            expect(err, 'We expect err to be null').to.exist;
            expect(err.message).to.equal('Activity expects output value: total.');

            done();
        });
});
