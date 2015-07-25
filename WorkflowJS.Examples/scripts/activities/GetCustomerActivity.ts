module wfjsExample.Activities
{
    export class GetCustomerActivity implements wfjs.IActivity
    {
        public $inputs = ['customerId'];
        public $outputs = ['customer'];

        public Execute(context: wfjs.ActivityContext, done: (err?: Error) => void): void
        {
            var customerId: number = parseInt(context.Inputs['customerId']);
            var customerService: Services.ICustomerService = context.Extensions['CustomerService'];

            if (customerId > 0 == false)
            {
                return done(new Error('customerId: Parameter is invalid.'));
            }

            if (customerService == null)
            {
                return done(new Error('CustomerService: Extension cannot be null.'));
            }

            customerService.GetCustomer(customerId, (err, customer) =>
            {
                if (err == null)
                {
                    context.Outputs['customer'] = customer;
                }

                done(err);
            });
        }
    }
}