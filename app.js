var MyActivity = (function () {
    function MyActivity() {
        this.$inputs = ['name'];
        this.$outputs = ['output'];
    }
    MyActivity.prototype.Execute = function (context, done) {
        var c = context.Extensions['console'];
        var name = context.Inputs['name'];
        var output = 'MyActivity.Execute: ' + name;
        context.Outputs['output'] = output;
        c.log('Execute');
        done(null);
    };
    return MyActivity;
})();
var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
        var activity = new MyActivity();
        var workflowApplication = new wfjs.WorkflowApplication(activity);
        workflowApplication.Extensions['console'] = console;
        workflowApplication.Inputs['name'] = 'Joel';
        workflowApplication.Run(function (err, context) {
            if (err != null) {
                console.log('finished with error: ', err);
            }
            else {
                console.log('result: ', context.Outputs['output']);
            }
            console.log('done.');
        });
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};
//# sourceMappingURL=app.js.map