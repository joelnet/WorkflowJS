var wfjsExample;
(function (wfjsExample) {
    var BasicWorkflow;
    (function (BasicWorkflow) {
        var Application = (function () {
            function Application(element) {
                this.element = element;
            }
            Application.prototype.Run = function () {
                var _this = this;
                var inputs = {
                    'number': 123
                };
                this.AppendToElement(this.element, 'Actions: [AddActivity]');
                this.AppendToElement(this.element, 'Inputs: ' + JSON.stringify(inputs));
                var workflow = {
                    $inputs: ['number'],
                    $outputs: ['total'],
                    activities: {
                        "Add 100": {
                            activity: new wfjs.Activities.AddActivity(),
                            $inputs: {
                                'number1': { name: 'number' },
                                'number2': { value: 100 }
                            },
                            $outputs: { 'total': 'total' },
                            next: "Multiply 2"
                        },
                        "Multiply 2": {
                            activity: new wfjs.Activities.MultiplyActivity(),
                            $inputs: {
                                'number1': { name: 'total' },
                                'number2': { value: 2 }
                            },
                            $outputs: { 'total': 'total' },
                            next: null
                        }
                    }
                };
                wfjs.WorkflowInvoker.CreateActivity(workflow).Inputs(inputs).Invoke(function (err, ctx) {
                    if (err != null) {
                        _this.AppendToElement(_this.element, 'finished with error: ' + err.toString());
                    }
                    else {
                        _this.AppendToElement(_this.element, 'Outputs: ' + JSON.stringify(ctx.Outputs));
                    }
                    _this.AppendToElement(_this.element, 'done.');
                });
            };
            Application.prototype.AppendToElement = function (element, text) {
                var el = document.createElement('div');
                el.innerText = text;
                element.appendChild(el);
            };
            return Application;
        })();
        window.onload = function () {
            var el = document.getElementById('content');
            var app = new Application(el);
            app.Run();
        };
    })(BasicWorkflow = wfjsExample.BasicWorkflow || (wfjsExample.BasicWorkflow = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=basicWorkflow.js.map