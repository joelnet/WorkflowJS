var wfjsExample;
(function (wfjsExample) {
    var Activities;
    (function (Activities) {
        var GetCustomerActivity = (function () {
            function GetCustomerActivity() {
                this.$inputs = ['customerId'];
                this.$outputs = ['customer'];
            }
            GetCustomerActivity.prototype.Execute = function (context, done) {
                var customerId = parseInt(context.Inputs['customerId']);
                var customerService = context.Extensions['CustomerService'];
                if (customerId > 0 == false) {
                    return done(new Error('customerId: Parameter is invalid.'));
                }
                if (customerService == null) {
                    return done(new Error('CustomerService: Extension cannot be null.'));
                }
                customerService.GetCustomer(customerId, function (err, customer) {
                    if (err == null) {
                        context.Outputs['customer'] = customer;
                    }
                    done(err);
                });
            };
            return GetCustomerActivity;
        })();
        Activities.GetCustomerActivity = GetCustomerActivity;
    })(Activities = wfjsExample.Activities || (wfjsExample.Activities = {}));
})(wfjsExample || (wfjsExample = {}));
//# sourceMappingURL=GetCustomerActivity.js.map