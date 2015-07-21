module wfjs.Services
{
    var loremIpsum = ("lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend "
        + "eros sit amet elit ultricies luctus nunc sit amet neque eu augue pellentesque tristique "
        + "fusce malesuada mi vel tellus egestas id posuere metus tristique praesent eget dapibus "
        + "sem nam convallis dolor sit amet velit condimentum at mollis nunc finibus nulla "
        + "malesuada tincidunt interdum nam ut metus id nibh sodales mattis id a augue pellentesque "
        + "fermentum mi eu ipsum pretium tincidunt ut orci nisi viverra eget mi ut tempor imperdiet "
        + "eros proin bibendum ligula ac venenatis finibus").split(' ');

    export interface ICustomerService
    {
        GetCustomer(customerId: number, callback: (err: Error, customer?: Models.Customer) => void): void;
        GetOrders(customerId: number, callback: (err: Error, orders: Models.Order[]) => void): void;
    }

    export class MockCustomerService implements ICustomerService
    {
        public GetCustomer(customerId: number, callback: (err: Error, customer?: Models.Customer) => void): void
        {
            var err: Error = null;
            var customer: Models.Customer = null;

            if (customerId < loremIpsum.length - 5)
            {
                customer = this._GetMockCustomer(customerId);
            }
            else
            {
                err = new Error(customerId + ': customer does not exist.');
            }

            callback(err, customer);
        }

        public GetOrders(customerId: number, callback: (err: Error, orders: Models.Order[]) => void): void
        {
            var err: Error = null;
            var orders: Models.Order[] = [];

            if (customerId < loremIpsum.length - 5)
            {
                for (var i = 0; i < loremIpsum[customerId].length; i++)
                {
                    orders.push(this._GetMockOrder(customerId, i));
                }
            }
            else
            {
                err = new Error(customerId + ': customer does not exist.');
            }

            callback(err, orders);
        }

        private _GetMockCustomer(customerId: number): Models.Customer
        {
            return {
                id: customerId,
                firstname: loremIpsum[-1 + customerId],
                lastname: loremIpsum[0 + customerId],
                email: loremIpsum[1 + customerId] + '@' + loremIpsum[2 + customerId] + '.' + loremIpsum[3 + customerId],
            };
        }

        private _GetMockOrder(customerId: number, orderId: number): Models.Order
        {
            return {
                id: customerId * 100 + orderId,
                date: new Date(),
                description: loremIpsum.slice(orderId, 5).join(' '),
                price: loremIpsum[orderId].length * 10
            };
        }
    }
}