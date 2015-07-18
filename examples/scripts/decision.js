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
                var flowchart = {
                    $outputs: ['result'],
                    activities: {
                        'GetUsersName': {
                            activity: new wfjs.Activities.PromptActivity(),
                            $inputs: {
                                message: { value: 'What is your name?' }
                            },
                            $outputs: { 'result': 'name' },
                            next: 'Decision:IsCancelled'
                        },
                        'Decision:IsCancelled': {
                            condition: 'this.name == null || this.name == ""',
                            ontrue: 'CreateMessage:NameRefusal',
                            onfalse: 'CreateMessage:Hello'
                        },
                        'CreateMessage:NameRefusal': {
                            output: 'result',
                            value: '"You did not enter a name!"',
                        },
                        'CreateMessage:Hello': {
                            output: 'result',
                            value: '"Hello " + this.name + "!"',
                        }
                    }
                };
                wfjs.WorkflowInvoker.CreateActivity(flowchart).Extensions({
                    "window": window
                }).Invoke(function (err, ctx) {
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
//# sourceMappingURL=decision.js.map