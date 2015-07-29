var wfjsTests;
(function (wfjsTests) {
    var Activities;
    (function (Activities) {

        var AsyncErrorActivity = (function ()
        {
            function AsyncErrorActivity()
            {
            }
            AsyncErrorActivity.prototype.Execute = function (context, done)
            {
                setTimeout(function ()
                {
                    done(new Error('ErrorActivity'));
                }, 0);

            };

            return AsyncErrorActivity;
        })();

        Activities.AsyncErrorActivity = AsyncErrorActivity;
    })(Activities = wfjsTests.Activities || (wfjsTests.Activities = {}));
})(wfjsTests || (wfjsTests = {}));
