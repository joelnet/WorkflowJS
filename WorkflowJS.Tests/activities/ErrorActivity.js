var wfjsTests;
(function (wfjsTests) {
    var Activities;
    (function (Activities) {

        var ErrorActivity = (function ()
        {
            function ErrorActivity()
            {
            }

            ErrorActivity.prototype.Execute = function (context, done)
            {
                throw new Error('ErrorActivity');
            };

            return ErrorActivity;
        })();

        Activities.ErrorActivity = ErrorActivity;
    })(Activities = wfjsTests.Activities || (wfjsTests.Activities = {}));
})(wfjsTests || (wfjsTests = {}));
